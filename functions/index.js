const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/* =====================================================
   UTILS
   ===================================================== */

function calcDurationMs({ days = 0, hours = 0, minutes = 0, seconds = 0 }) {
  return (
    days * 86400000 +
    hours * 3600000 +
    minutes * 60000 +
    seconds * 1000
  );
}

function calcWarnAt(expiredAtMs, durationMs) {
  let warningOffset;

  if (durationMs >= 86400000 * 30) {
    // ≥ 30 hari → 10 hari
    warningOffset = 86400000 * 10;
  } else if (durationMs >= 86400000 * 7) {
    // 7–29 hari → 1 hari
    warningOffset = 86400000;
  } else {
    // < 24 jam → 20%
    warningOffset = Math.floor(durationMs * 0.2);
  }

  return expiredAtMs - warningOffset;
}

/* =====================================================
   EXTEND LINK (SECURE)
   ===================================================== */

exports.extendLinkDuration = functions.https.onCall(
  async (data, context) => {

    /* ================= AUTH ================= */

    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login diperlukan"
      );
    }

    const uid = context.auth.uid;
    const { linkId, duration } = data;

    if (!linkId || !duration) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Data tidak lengkap"
      );
    }

    const durationMs = calcDurationMs(duration);

    if (durationMs <= 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Durasi tidak valid"
      );
    }

    /* ================= REFS ================= */

    const userRef = db.doc(`users/${uid}`);
    const linkRef = db.doc(`links/${linkId}`);

    /* ================= TRANSACTION ================= */

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const linkSnap = await tx.get(linkRef);

      if (!userSnap.exists) {
        throw new functions.https.HttpsError("not-found", "User tidak ditemukan");
      }

      if (!linkSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Link tidak ditemukan");
      }

      const user = userSnap.data();
      const link = linkSnap.data();

      /* ===== OWNERSHIP ===== */

      if (link.ownerId !== uid) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Bukan pemilik link"
        );
      }

      /* ===== COST ===== */
      // 1 hari = 230 coin
      const costPerDay = 230;
      const daysEquivalent = Math.ceil(durationMs / 86400000);
      const cost = daysEquivalent * costPerDay;

      if (user.coin < cost) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Coin tidak cukup"
        );
      }

      /* ===== TIME CALC ===== */

      const baseExpiredAt =
        link.expiredAt > Date.now() ? link.expiredAt : Date.now();

      const newExpiredAt = baseExpiredAt + durationMs;
      const warnAt = calcWarnAt(newExpiredAt, durationMs);

      /* ===== UPDATE ===== */

      tx.update(userRef, {
        coin: admin.firestore.FieldValue.increment(-cost)
      });

      tx.update(linkRef, {
        expiredAt: newExpiredAt,
        warnAt: warnAt
      });
    });

    return {
      success: true,
      message: "Link berhasil diperpanjang"
    };
  }
);

