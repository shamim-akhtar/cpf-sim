// config.js
// CPF Simulation Configuration

var CPFConfig = {
    // Maximum salary for CPF contributions
    CONST_SALARY_CAP: 7400.0,
    
    RetirementAge: 65,

    // Initial values for Basic Healthcare Sum (BHS) and Full Retirement Sum (FRS)
    currentBHS: 75500.0,
    currentFRS: 213800,

    // Function that returns allocation rates based on age.
    getAllocationRate: function(age) {
        if (age < 35) return [0.37 * 0.6217, 0.37 * 0.1621, 0.37 * 0.2162];
        if (age >= 35 && age < 45) return [0.37 * 0.5677, 0.37 * 0.1891, 0.37 * 0.2432];
        if (age >= 45 && age < 50) return [0.37 * 0.5136, 0.37 * 0.2162, 0.37 * 0.2702];
        if (age >= 50 && age < 55) return [0.37 * 0.4055, 0.37 * 0.3108, 0.37 * 0.2837];
        if (age >= 55 && age < 60) return [0.325 * 0.3694, 0.325 * 0.3076, 0.325 * 0.3230];
        if (age >= 60 && age < 65) return [0.235 * 0.149, 0.235 * 0.4042, 0.235 * 0.4468];
        if (age >= 65 && age < 70) return [0.165 * 0.0607, 0.165 * 0.303, 0.165 * 0.6363];
        if (age >= 70) return [0.125 * 0.08, 0.125 * 0.08, 0.125 * 0.84];
    }
};
