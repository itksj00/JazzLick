'use strict';

const FB = (() => {
  let _db = null;
  let _cfg = null;

  const TRUST_WEIGHTS = {
    beginner: 1.0,
    elementary: 1.5,
    intermediate: 2.5,
    advanced: 4.0,
    professional: 6.0,
    instructor: 8.0,
  };

  function configure(cfg) {
    _cfg = cfg;
    firebase.initializeApp(cfg);
    _db = firebase.firestore();
  }

  function isReady() { return !!_db; }

  function getUserProfile() {
    try { return JSON.parse(localStorage.getItem('jl_profile') || 'null'); } catch { return null; }
  }

  function saveUserProfile(profile) {
    localStorage.setItem('jl_profile', JSON.stringify(profile));
  }

  function getTrustWeight(level) {
    return TRUST_WEIGHTS[level] || 1.0;
  }

  async function saveFeedback({ type, mode, input, systemResult, userResult, rating, profile }) {
    if (!_db) return;
    const p = profile || getUserProfile() || {};
    const weight = getTrustWeight(p.level);
    await _db.collection('feedback').add({
      type,
      mode,
      input,
      systemResult,
      userResult: userResult || null,
      rating,
      profile: { level: p.level || 'unknown', goal: p.goal || 'unknown' },
      trustWeight: weight,
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  async function saveEdit({ mode, input, systemResult, userResult, profile }) {
    if (!_db) return;
    const p = profile || getUserProfile() || {};
    const weight = getTrustWeight(p.level);
    await _db.collection('edits').add({
      mode,
      input,
      systemResult,
      userResult,
      profile: { level: p.level || 'unknown', goal: p.goal || 'unknown' },
      trustWeight: weight,
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  return { configure, isReady, getUserProfile, saveUserProfile, getTrustWeight, saveFeedback, saveEdit };
})();

window.FB = FB;
