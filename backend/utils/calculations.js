function calculateBMR(weight, height, age, gender) {
    if (!weight || !height || !age || !gender) return null;

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'man') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.round(bmr);
}

function calculateTDEE(bmr, activityLevel) {
    if (!bmr || !activityLevel) return null;

    const multipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    };

    // Simple fuzzy matching or default to sedentary
    let multiplier = 1.2;
    const lowerActivity = activityLevel.toLowerCase();

    if (lowerActivity.includes('sedentary')) multiplier = 1.2;
    else if (lowerActivity.includes('light')) multiplier = 1.375;
    else if (lowerActivity.includes('moderate')) multiplier = 1.55;
    else if (lowerActivity.includes('very')) multiplier = 1.725;
    else if (lowerActivity.includes('extra') || lowerActivity.includes('athlete')) multiplier = 1.9;

    return Math.round(bmr * multiplier);
}

function calculateTarget(tdee, goals) {
    if (!tdee || !goals || goals.length === 0) return tdee; // Maintenance default

    let adjustment = 0;
    const goalStr = goals.join(' ').toLowerCase();

    if (goalStr.includes('lose') || goalStr.includes('weight loss')) {
        adjustment = -500;
    } else if (goalStr.includes('gain') || goalStr.includes('muscle')) {
        adjustment = 250;
    }

    return tdee + adjustment;
}

module.exports = { calculateBMR, calculateTDEE, calculateTarget };
