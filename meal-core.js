// Yaspii Meal Spin — pure logic + data. No DOM, so it can be reused in a WeChat mini program or a native app.
(function (root) {
  // Typical single-serving estimates (kcal). Rough on purpose; portions vary a lot.
  const DISHES = [
    { id: "somtam", kcal: 130, name: { en: "Som Tam (papaya salad)", zh: "青木瓜沙拉", th: "ส้มตำ" } },
    { id: "tomyum", kcal: 160, name: { en: "Tom Yum Goong (clear)", zh: "冬阴功汤（清汤）", th: "ต้มยำกุ้งน้ำใส" } },
    { id: "gaengsom", kcal: 200, name: { en: "Gaeng Som (sour curry)", zh: "酸咖喱鱼汤", th: "แกงส้ม" } },
    { id: "yamwoonsen", kcal: 240, name: { en: "Yam Woon Sen (glass noodle salad)", zh: "凉拌粉丝", th: "ยำวุ้นเส้น" } },
    { id: "larbgai", kcal: 250, name: { en: "Larb Gai (minced chicken salad)", zh: "泰式鸡肉末沙拉", th: "ลาบไก่" } },
    { id: "plamanao", kcal: 280, name: { en: "Pla Neung Manao (steamed lime fish)", zh: "柠檬蒸鱼", th: "ปลานึ่งมะนาว" } },
    { id: "jok", kcal: 300, name: { en: "Jok (rice porridge)", zh: "泰式米粥", th: "โจ๊ก" } },
    { id: "gaiyang", kcal: 320, name: { en: "Gai Yang (grilled chicken)", zh: "泰式烤鸡", th: "ไก่ย่าง" } },
    { id: "boatnoodle", kcal: 350, name: { en: "Kuay Teow Reua (boat noodles)", zh: "船面", th: "ก๋วยเตี๋ยวเรือ" } },
    { id: "satay", kcal: 360, name: { en: "Satay Gai (chicken satay)", zh: "沙爹鸡肉串", th: "สะเต๊ะไก่" } },
    { id: "tomkha", kcal: 380, name: { en: "Tom Kha Gai (coconut chicken soup)", zh: "椰汁鸡汤", th: "ต้มข่าไก่" } },
    { id: "mango", kcal: 450, name: { en: "Mango Sticky Rice", zh: "芒果糯米饭", th: "ข้าวเหนียวมะม่วง" } },
    { id: "kaijeow", kcal: 500, name: { en: "Kai Jeow (Thai omelette) with rice", zh: "泰式煎蛋饭", th: "ข้าวไข่เจียว" } },
    { id: "khaopad", kcal: 560, name: { en: "Khao Pad (fried rice)", zh: "泰式炒饭", th: "ข้าวผัด" } },
    { id: "padthai", kcal: 600, name: { en: "Pad Thai", zh: "泰式炒河粉", th: "ผัดไทย" } },
    { id: "greencurry", kcal: 600, name: { en: "Green Curry with rice", zh: "绿咖喱鸡饭", th: "ข้าวแกงเขียวหวาน" } },
    { id: "khaomangai", kcal: 610, name: { en: "Khao Man Gai (chicken rice)", zh: "海南鸡饭", th: "ข้าวมันไก่" } },
    { id: "padseeew", kcal: 620, name: { en: "Pad See Ew", zh: "泰式酱油炒粉", th: "ผัดซีอิ๊ว" } },
    { id: "khaosoi", kcal: 650, name: { en: "Khao Soi", zh: "泰北咖喱面", th: "ข้าวซอย" } },
    { id: "kraprao", kcal: 680, name: { en: "Pad Kra Pao with rice and egg", zh: "打抛猪饭配煎蛋", th: "ผัดกะเพราข้าวไข่ดาว" } },
    { id: "massaman", kcal: 750, name: { en: "Massaman Curry with rice", zh: "马沙文咖喱饭", th: "ข้าวแกงมัสมั่น" } }
  ];

  const FLOOR = { female: 1200, male: 1500 };

  // Mifflin–St Jeor resting energy, kcal/day.
  function bmr(p) {
    const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
    return Math.round(p.sex === "male" ? base + 5 : base - 161);
  }

  // "Daily burn at rest": resting energy x 1.2 (sedentary). Deliberately conservative.
  function dailyBurn(p) { return Math.round(bmr(p) * 1.2); }

  // Small deficit: 15% of daily burn, at most 500 kcal, never below the floor, none for under-18s.
  function dailyTarget(p) {
    const burn = dailyBurn(p);
    if (p.age < 18) return { burn, deficit: 0, target: burn };
    const deficit = Math.min(500, Math.round(burn * 0.15));
    const target = Math.max(FLOOR[p.sex] || 1200, burn - deficit);
    return { burn, deficit: burn - target, target };
  }

  function remaining(p, eatenToday) {
    const t = dailyTarget(p);
    return { ...t, eaten: eatenToday, left: Math.max(0, t.target - eatenToday) };
  }

  // Dishes that fit what's left, up to `max`, spread across the calorie range.
  function candidates(left, max = 8) {
    const fit = DISHES.filter(d => d.kcal <= left);
    if (fit.length <= max) return fit;
    const out = [];
    for (let i = 0; i < max; i++) out.push(fit[Math.round(i * (fit.length - 1) / (max - 1))]);
    return out;
  }

  function validProfile(p) {
    return p && (p.sex === "male" || p.sex === "female") &&
      p.age >= 10 && p.age <= 100 && p.heightCm >= 100 && p.heightCm <= 230 && p.weightKg >= 25 && p.weightKg <= 300;
  }

  const api = { DISHES, bmr, dailyBurn, dailyTarget, remaining, candidates, validProfile };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YaspiiMeal = api;
})(typeof window !== "undefined" ? window : this);
