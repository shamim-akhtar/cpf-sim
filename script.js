/**********************************************************
 *  CPF CONFIG
 **********************************************************/
var CPFConfig = {
    // Monthly CPF salary cap:
    CONST_SALARY_CAP: 7400.0,
    
    // Default official Retirement Age:
    RetirementAge: 65,
  
    // Current BHS & FRS used for base calculations:
    currentBHS: 75500.0,
    currentFRS: 213800,
  
    // CPF Annual Limit:
    CPFAnnualLimit: 37740.0,
  
    // CPF Allocation rates by age bracket. (As of 2024/2025)
    // This returns an array [OA%, SA%, MA%], each is fraction of wage subject to CPF
    getAllocationRate: function(age) {
      // If you are applying new post-55 rules (SA is effectively “closed”), you might adjust logic further,
      // but the below is standard prior to the code that re-routes post-55 contributions to RA.
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
  
  /**********************************************************
   *  HELPER FUNCTIONS
   **********************************************************/
  function toFixed(value, preci) {
    var precision = preci || 0,
        power = Math.pow(10, precision),
        absValue = Math.abs(Math.round(value * power)),
        result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));
    if (precision > 0) {
      var fraction = String(absValue % power),
          padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
      result += '.' + padding + fraction;
    }
    return result;
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  /**********************************************************
   *  CORE SIMULATION FUNCTIONS
   **********************************************************/
  
  // Transfer from MA if it exceeds BHS, either to SA (pre-55) or RA (post-55), up to FRS. Excess then goes to OA.
  function MAToSATransfer(age, balance, currentBHS, currentFRS, tfr) {
    // balance array = [OA, SA, MA, RA]
    // tfr array tracks how much is transferred: [OA, SA, MA, RA]
    if (balance[2] > currentBHS) {
      var amt = balance[2] - currentBHS;
      if (age < 55) {
        // If SA < FRS, top up SA first.
        if (balance[1] < currentFRS) {
          balance[1] += amt;
          balance[2] -= amt;
          tfr[1] += amt;
          tfr[2] -= amt;
          // If that pushes SA beyond FRS, move excess to OA
          if (balance[1] > currentFRS) {
            var overflow = balance[1] - currentFRS;
            balance[1] = currentFRS;
            balance[0] += overflow;
            tfr[1] -= overflow;
            tfr[0] += overflow;
          }
        } else {
          // else everything goes to OA
          balance[0] += amt;
          balance[2] -= amt;
          tfr[0] += amt;
          tfr[2] -= amt;
        }
      } else {
        // For age >= 55, top up RA if below FRS, else OA
        if (balance[3] < currentFRS) {
          balance[3] += amt;
          balance[2] -= amt;
          tfr[3] += amt;
          tfr[2] -= amt;
          if (balance[3] > currentFRS) {
            var overflow = balance[3] - currentFRS;
            balance[3] = currentFRS;
            balance[0] += overflow;
            tfr[3] -= overflow;
            tfr[0] += overflow;
          }
        } else {
          balance[0] += amt;
          balance[2] -= amt;
          tfr[0] += amt;
          tfr[2] -= amt;
        }
      }
    }
  }
  
  // Returns array [contribution_OA, contribution_SA, contribution_MA, 0.0]
  function getContrib(age, sal) {
    var allocRate = CPFConfig.getAllocationRate(age);
    var cappedSalary = Math.min(sal, CPFConfig.CONST_SALARY_CAP);
    return [
      allocRate[0] * cappedSalary,
      allocRate[1] * cappedSalary,
      allocRate[2] * cappedSalary,
      0.0
    ];
  }
  
  // Global arrays to hold multiple runs
  var data_collection_array = [];
  var name_array = [];
  
  // Chart references
  var chart_total_balances = null;
  var chart_total_accounts = null;
  var chart_doughnut1 = null;
  var chart_doughnut2 = null;
  
  // Logging
  var logtext = "";
  var WRITE_LOG = true;
  function log(v) {
    if (WRITE_LOG) {
      logtext += v + "<br>";
    }
  }
  
  // Main function that does the year-by-year calculations
  function Simulate() {
    // Read form inputs
    var SIMULATION_NAME = document.getElementById("inputName").value;
    var AGE = parseFloat(document.getElementById("inputAge").value);
    var SALARY = parseFloat(document.getElementById("inputSalary").value);
    var CASH = parseFloat(document.getElementById("inputCash").value);
    var BONUS_MONTHS = parseFloat(document.getElementById("inputBonus").value);
    var START_OA = parseFloat(document.getElementById("inputOA").value);
    var START_SA = parseFloat(document.getElementById("inputSA").value);
    var START_MA = parseFloat(document.getElementById("inputMA").value);
    var BHS_RATE = parseFloat(document.getElementById("inputBHSRate").value);
    var FRS_RATE = parseFloat(document.getElementById("inputFRSRate").value);
    var HOUSING = parseFloat(document.getElementById("inputHousing").value);
    var DPS = parseFloat(document.getElementById("inputDPS").value);
    var DPS_M = parseInt(document.getElementById("inputDPSM").value);
    var HPS = parseFloat(document.getElementById("inputHPS").value);
    var HPS_M = parseInt(document.getElementById("inputHPSM").value);
    var MEDISHIELD = parseFloat(document.getElementById("inputMedishield").value);
    var MEDISHIELD_M = parseInt(document.getElementById("inputMedishieldM").value);
    var ELDERSHIELD = parseFloat(document.getElementById("inputEldershield").value);
    var ELDERSHIELD_M = parseInt(document.getElementById("inputEldershieldM").value);
    var ALLOW_OA_SA_TFR = document.getElementById("allow_oa_sa").checked;
  
    // Prepare arrays for monthly premium deductions:
    // We'll store them in zero-based index. So if DPS_M=1 means January => dpsArr[0].
    var dpsArr = new Array(12).fill(0);
    var hpsArr = new Array(12).fill(0);
    var medArr = new Array(12).fill(0);
    var edsArr = new Array(12).fill(0);
  
    if (DPS > 0 && DPS_M >= 1 && DPS_M <= 12) {
      dpsArr[DPS_M - 1] = DPS;
    }
    if (HPS > 0 && HPS_M >= 1 && HPS_M <= 12) {
      hpsArr[HPS_M - 1] = HPS;
    }
    if (MEDISHIELD > 0 && MEDISHIELD_M >= 1 && MEDISHIELD_M <= 12) {
      medArr[MEDISHIELD_M - 1] = MEDISHIELD;
    }
    if (ELDERSHIELD > 0 && ELDERSHIELD_M >= 1 && ELDERSHIELD_M <= 12) {
      edsArr[ELDERSHIELD_M - 1] = ELDERSHIELD;
    }
  
    // The core function that calculates for each year from currentAge until RetirementAge
    function getProjectedValues(currentAge, currentBHS, currentFRS, numberOfYears, bhsRate, frsRate, allow) {
      var data_collection = [];
      // Accounts: [OA, SA, MA, RA]
      var balance = [START_OA, START_SA, START_MA, 0];
      var age = currentAge;
      var retirementCutOff = numberOfYears + currentAge;
  
      while (age <= retirementCutOff) {
        // Increase BHS each year
        currentBHS = currentBHS * (1 + bhsRate);
  
        // Increase FRS each year if age < 55
        if (age < 55) {
          currentFRS = currentFRS * (1 + frsRate);
        }
  
        // track yearly sums of contributions, deductions, interest, transfers
        var con = [0, 0, 0, 0];
        var ded = [0, 0, 0, 0];
        var int = [0, 0, 0, 0];
        var tfr = [0, 0, 0, 0];
  
        // We'll handle monthly flow in a 12-month loop
        var bon = new Array(12).fill(0);
        bon[0] = BONUS_MONTHS; // assume bonus is credited in January
        // Housing, DPS, HPS, MediShield, ElderShield are accounted for via monthly arrays or direct below
        // The user placed HOUSING as a single monthly figure, but you could do more advanced logic.
  
        for (var m = 0; m < 12; ++m) {
          // 1) Regular monthly CPF contributions
          var contrib = getContrib(age, SALARY);
  
          // If user < 55, OA/SA/MA contributions remain as is
          // If user >= 55, code lumps SA portion into RA (since SA is effectively “closed” from 2025 onward)
          if (age < 55) {
            balance[0] += contrib[0];
            balance[1] += contrib[1];
            balance[2] += contrib[2];
            balance[3] += contrib[3]; // always 0, but left for clarity
  
            // Monthly top-up to SA (up to FRS)
            if (balance[1] < currentFRS) {
              var neededSA = currentFRS - balance[1];
              var amt = Math.min(CASH, neededSA);
              balance[1] += amt;
              tfr[1] += amt;
            }
  
          } else {
            // Post-55 scenario – the code lumps any SA portion into RA:
            balance[0] += contrib[0];
            balance[2] += contrib[2];
            balance[3] += (contrib[1] + contrib[3]);
  
            // Monthly top-up to RA (up to FRS)
            if (balance[3] < currentFRS) {
              var neededRA = currentFRS - balance[3];
              var amt = Math.min(CASH, neededRA);
              balance[3] += amt;
              tfr[3] += amt;
            }
          }
  
          // 2) Bonus contributions
          if (bon[m] > 0) {
            // separate integer part and decimal part
            var fullMonths = Math.floor(bon[m]);
            var partial = bon[m] - fullMonths;
            // add each full bonus month of salary
            for (var b = 0; b < fullMonths; b++) {
              var c2 = getContrib(age, SALARY);
              if (age < 55) {
                balance[0] += c2[0];
                balance[1] += c2[1];
                balance[2] += c2[2];
                balance[3] += c2[3];
              } else {
                balance[0] += c2[0];
                balance[2] += c2[2];
                balance[3] += (c2[1] + c2[3]);
              }
              con[0] += c2[0];
              con[1] += c2[1];
              con[2] += c2[2];
              con[3] += c2[3];
            }
            // partial month bonus
            var partialContrib = getContrib(age, SALARY * partial);
            if (age < 55) {
              balance[0] += partialContrib[0];
              balance[1] += partialContrib[1];
              balance[2] += partialContrib[2];
              balance[3] += partialContrib[3];
            } else {
              balance[0] += partialContrib[0];
              balance[2] += partialContrib[2];
              balance[3] += (partialContrib[1] + partialContrib[3]);
            }
            con[0] += partialContrib[0];
            con[1] += partialContrib[1];
            con[2] += partialContrib[2];
            con[3] += partialContrib[3];
          }
  
          // 3) Housing deduction from OA (if you have monthly mortgage):
          if (HOUSING > 0) {
            // you might do an actual check for insufficient OA
            balance[0] -= HOUSING;
            ded[0] += HOUSING;
          }
  
          // 4) If user < 55, optionally do OA->SA transfer (only if allowed and SA<FRS)
          if (age < 55 && allow) {
            if (balance[1] < currentFRS) {
              var needed2 = currentFRS - balance[1];
              var transf2 = Math.min(balance[0], needed2);
              balance[1] += transf2;
              balance[0] -= transf2;
              tfr[1] += transf2;
              tfr[0] -= transf2;
            }
          }
  
          // 5) Transfer from MA if above BHS
          MAToSATransfer(age, balance, currentBHS, currentFRS, tfr);
  
          // 6) Deduct monthly insurance premiums:
          var dpsDed = dpsArr[m];
          var hpsDed = hpsArr[m];
          var medDed = medArr[m];
          var edsDed = edsArr[m];
  
          // DPS & HPS typically come out of OA:
          if (dpsDed > 0) {
            balance[0] -= dpsDed;
            ded[0] += dpsDed;
          }
          if (hpsDed > 0) {
            balance[0] -= hpsDed;
            ded[0] += hpsDed;
          }
  
          // MediShield & ElderShield typically come out of MA:
          if (medDed > 0) {
            balance[2] -= medDed;
            ded[2] += medDed;
          }
          if (edsDed > 0) {
            balance[2] -= edsDed;
            ded[2] += edsDed;
          }
  
          // 7) Calculate monthly interest for each account (simple approx)
          var oa_int = balance[0] * 0.025 / 12;
          var sa_int = (age < 55 ? balance[1] : 0) * 0.04 / 12;
          var ma_int = balance[2] * 0.04 / 12;
          var ra_int = balance[3] * 0.04 / 12;
  
          int[0] += oa_int;
          int[1] += sa_int;
          int[2] += ma_int;
          int[3] += ra_int;
        } // end of 12-month loop
  
        // 8) Add the interest at the end of the year
        balance[0] += int[0];
        balance[1] += int[1];
        balance[2] += int[2];
        balance[3] += int[3];
  
        // 9) Re-check MA > BHS after interest
        MAToSATransfer(age, balance, currentBHS, currentFRS, tfr);
  
        // 10) At exactly age 55, form/adjust RA by transferring SA up to FRS
        if (age === 55) {
          // Transfer entire SA into RA up to FRS
          var transferAmount = balance[1];
          balance[1] = 0;
          if (balance[3] + transferAmount <= currentFRS) {
            balance[3] += transferAmount;
          } else {
            // only top up RA to FRS
            var neededRA = currentFRS - balance[3];
            if (neededRA > 0) {
              balance[3] += neededRA;
              balance[0] += (transferAmount - neededRA);
            } else {
              // if RA is already at FRS, everything goes to OA
              balance[0] += transferAmount;
            }
          }
        }
  
        // push final year-end data
        data_collection.push({
          "age": age,
          "BHS": currentBHS,
          "FRS": currentFRS,
          "OA": [con[0], ded[0], int[0], balance[0], tfr[0]],
          "SA": [con[1], ded[1], int[1], balance[1], tfr[1]],
          "MA": [con[2], ded[2], int[2], balance[2], tfr[2]],
          "RA": [con[3], ded[3], int[3], balance[3], tfr[3]]
        });
        age++;
      } // end while
      data_collection_array.push(data_collection);
      name_array.push(SIMULATION_NAME);
    }
  
    // Run the projection from user’s age up to official retirement age
    getProjectedValues(
      AGE,
      71500.0,   // or use CPFConfig.currentBHS if you prefer
      205800,    // or use CPFConfig.currentFRS
      CPFConfig.RetirementAge - AGE,
      BHS_RATE / 100,
      FRS_RATE / 100,
      ALLOW_OA_SA_TFR
    );
  }
  
  // This prints final data at age ~55 and ~65 onto the HTML
  function Print_TotalBalances_New() {
    var data_collection = data_collection_array[data_collection_array.length - 1];
    var name = name_array[name_array.length - 1];
  
    var acc55 = [0, 0, 0, 0];
    var acc65 = [0, 0, 0, 0];
    var bhs55, bhs65, frs55;
    var oa_sa55 = 0, oa_sa65 = 0;
    var total55 = 0, total65 = 0;
    var withdraw_amt = 0;
  
    for (var i in data_collection) {
      // note: picking age == 54 as "just before 55"
      if (data_collection[i]["age"] == 54) {
        acc55[0] = data_collection[i]["OA"][3];
        acc55[1] = data_collection[i]["SA"][3];
        acc55[2] = data_collection[i]["MA"][3];
        acc55[3] = data_collection[i]["RA"][3];
        bhs55 = data_collection[i]["BHS"];
        frs55 = data_collection[i]["FRS"];
        oa_sa55 = acc55[0] + acc55[1];
        total55 = acc55[0] + acc55[1] + acc55[2] + acc55[3];
        withdraw_amt = oa_sa55 - frs55;
      }
      // picking age == 64 as "just before 65"
      if (data_collection[i]["age"] == 64) {
        acc65[0] = data_collection[i]["OA"][3];
        acc65[1] = data_collection[i]["SA"][3];
        acc65[2] = data_collection[i]["MA"][3];
        acc65[3] = data_collection[i]["RA"][3];
        bhs65 = data_collection[i]["BHS"];
        oa_sa65 = acc65[0] + acc65[1];
        total65 = acc65[0] + acc65[1] + acc65[2] + acc65[3];
      }
    }
  
    // Update DOM for 55
    document.getElementById('Print_TotalBalances55').innerHTML =
      "You will have <b class=\"text-primary\">" +
      total55.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in your CPF accounts.<br>";
  
    document.getElementById('Print_TotalBalances55_Details').innerHTML =
      "Your projected account balance would be <b class=\"text-danger\">" +
      acc55[0].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Ordinary Account (OA), <b class=\"text-primary\">" +
      acc55[1].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Special Account (SA), and <b class=\"text-warning\">" +
      acc55[2].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Medisave Account (MA). The projected Full Retirement Sum based on the rate of increase you provided will be <b class=\"text-info\">" +
      frs55.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> and the maximum amount you could withdraw without a property pledge will be <b class=\"text-success\">" +
      withdraw_amt.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) + ".</b>";
  
    // Update DOM for 65
    document.getElementById('Print_TotalBalances65').innerHTML =
      "You will have <b class=\"text-primary\">" +
      total65.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in your CPF accounts.<br>";
  
    document.getElementById('Print_TotalBalances65_Details').innerHTML =
      "Your projected account balance would be <b class=\"text-danger\">" +
      acc65[0].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Ordinary Account (OA), <b class=\"text-primary\">" +
      
      acc65[2].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Medisave Account (MA), and <b class=\"text-info\">" +
      acc65[3].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Retirement Account (RA). <br> It assumes that you did not withdraw any money from your CPF from age 55 until 65.";
  
    // Doughnut charts
    if (chart_doughnut1 == null) {
      chart_doughnut1 = CreateDoughnutChart(
        document.getElementById('doughnut_TOTAL_BALANCES_55'),
        acc55,
        ['OA', 'SA', 'MA']
      );
      chart_doughnut1.update();
    }
    if (chart_doughnut2 == null) {
      chart_doughnut2 = CreateDoughnutChart(
        document.getElementById('doughnut_TOTAL_BALANCES_65'),
        acc65,
        ['OA', 'SA', 'MA', 'RA']
      );
      chart_doughnut2.update();
    }
  }
  
  // Create doughnut charts for OA/SA/MA/RA
  function CreateDoughnutChart(ctx, accdata, lbs) {
    const data = {
      labels: lbs,
      datasets: [{
        label: 'Account information',
        data: accdata,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(155, 155, 155)'
        ],
        hoverOffset: 4
      }]
    };
    const config = {
      type: 'doughnut',
      data: data,
      options: {
        cutoutPercentage: 30,
        animateScale: true,
        maintainAspectRatio: true,
        responsive: true,
        layout: { padding: 0 },
        plugins: {
          legend: { position: 'bottom', align: 'start' },
          title: { display: true, text: 'Account Information' }
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            title: function (tooltipItems, data) {
              return data.labels[tooltipItems[0].index];
            },
            label: function (tooltipItems, data) {
              return data.datasets[0].data[tooltipItems.index]
                .toLocaleString("en-SG", { style: "currency", currency: "SGD" });
            }
          }
        }
      }
    };
    return new Chart(ctx, config);
  }
  
  // Draw line chart #1 for total balances
  function DrawChart_TotalBalances() {
    var labels = [];
    var balances = [];
    var balances_oa_sa = [];
    var balances_ra = [];
    var n = data_collection_array.length - 1;
    var data_collection = data_collection_array[n];
    var name = name_array[n];
    for (var i in data_collection) {
      labels.push(data_collection[i]["age"]);
      var totalVal = data_collection[i]["OA"][3] +
                     data_collection[i]["SA"][3] +
                     data_collection[i]["MA"][3] +
                     data_collection[i]["RA"][3];
      balances.push({ x: data_collection[i]["age"], y: toFixed(totalVal, 2) });
      var oa_sa = data_collection[i]["OA"][3] + data_collection[i]["SA"][3];
      balances_oa_sa.push({ x: data_collection[i]["age"], y: toFixed(oa_sa, 2) });
      var ra = data_collection[i]["RA"][3];
      balances_ra.push({ x: data_collection[i]["age"], y: toFixed(ra, 2) });
    }
    var newDataSet1 = {
      label: name + " Total CPF Balance",
      data: balances,
      fill: false,
      borderColor: '#339BFF',
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    var newDataSet2 = {
      label: name + " OA and SA Balance",
      data: balances_oa_sa,
      fill: false,
      borderColor: '#FF7F33',
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    var newDataSet3 = {
      label: name + " RA Balance",
      data: balances_ra,
      fill: false,
      borderColor: '#9733FF',
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    chart_total_balances.data.labels = labels;
    chart_total_balances.data.datasets.push(newDataSet1, newDataSet2, newDataSet3);
    chart_total_balances.update();
  }
  
  // Draw line chart #2 for individual accounts
  function DrawChart_TotalAccounts() {
    var labels = [];
    var balances_oa = [];
    var balances_sa = [];
    var balances_ma = [];
    var balances_ra = [];
    var n = data_collection_array.length - 1;
    var data_collection = data_collection_array[n];
    var name = name_array[n];
    for (var i in data_collection) {
      labels.push(data_collection[i]["age"]);
      balances_oa.push({ x: data_collection[i]["age"], y: toFixed(data_collection[i]["OA"][3], 2) });
      balances_sa.push({ x: data_collection[i]["age"], y: toFixed(data_collection[i]["SA"][3], 2) });
      balances_ma.push({ x: data_collection[i]["age"], y: toFixed(data_collection[i]["MA"][3], 2) });
      balances_ra.push({ x: data_collection[i]["age"], y: toFixed(data_collection[i]["RA"][3], 2) });
    }
    var newDataSet1 = {
      label: name + " OA Balance",
      data: balances_oa,
      fill: false,
      borderColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    var newDataSet2 = {
      label: name + " SA Balance",
      data: balances_sa,
      fill: false,
      borderColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    var newDataSet3 = {
      label: name + " MA Balance",
      data: balances_ma,
      fill: false,
      borderColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    var newDataSet4 = {
      label: name + " RA Balance",
      data: balances_ra,
      fill: false,
      borderColor: getRandomColor(),
      backgroundColor: getRandomColor(),
      borderCapStyle: 'square',
      borderWidth: 2,
      pointRadius: 1.5
    };
    chart_total_accounts.data.labels = labels;
    chart_total_accounts.data.datasets.push(newDataSet1, newDataSet2, newDataSet3, newDataSet4);
    chart_total_accounts.update();
  }
  
  // Create line charts if not created yet
  function CreateChart_TotalBalances() {
    if (chart_total_balances != null) return;
    var mydata = { labels: [], datasets: [] };
    var ctx = document.getElementById('chart_TOTAL_BALANCES');
    var chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 15, fontColor: 'black' }
      },
      title: { display: true, text: 'Account Balance' },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              var ranges = [
                { divider: 1e6, suffix: 'M' },
                { divider: 1e3, suffix: 'k' }
              ];
              function formatNumber(n) {
                for (var i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                  }
                }
                return n;
              }
              return '$' + formatNumber(value);
            }
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: function (tooltipItems, data) {
            var label = data.datasets[tooltipItems[0].datasetIndex].label || '';
            return label;
          },
          label: function (tooltipItems, data) {
            var label = data.datasets[tooltipItems.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            return " Age:" + tooltipItems.xLabel + " | " +
              tooltipItems.yLabel.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
          }
        }
      }
    };
    chart_total_balances = new Chart(ctx, {
      type: 'line',
      data: mydata,
      options: chartOptions
  });
  document.getElementById('chart_TOTAL_BALANCES').style.display = "none";
  }
  
  function CreateChart_TotalAccounts() {
    if (chart_total_accounts != null) return;
    var mydata = { labels: [], datasets: [] };
    var ctx = document.getElementById('chart_TOTAL_ACCOUNTS');
    var chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 15, fontColor: 'black' }
      },
      title: { display: true, text: 'Account Balance' },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              var ranges = [
                { divider: 1e6, suffix: 'M' },
                { divider: 1e3, suffix: 'k' }
              ];
              function formatNumber(n) {
                for (var i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix;
                  }
                }
                return n;
              }
              return '$' + formatNumber(value);
            }
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: function (tooltipItems, data) {
            var label = data.datasets[tooltipItems[0].datasetIndex].label || '';
            return label;
          },
          label: function (tooltipItems, data) {
            var label = data.datasets[tooltipItems.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            return " Age:" + tooltipItems.xLabel + " | " +
              tooltipItems.yLabel.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
          }
        }
      }
    };
    chart_total_accounts = new Chart(ctx, {
      type: 'line',
      data: mydata,
      options: chartOptions
  });
  document.getElementById('chart_TOTAL_ACCOUNTS').style.display = "none";
  }
  
  // Functions for printing tables, etc.
  // (Unmodified except minor bug fixes or naming)
  
  function Print_TotalBalances() {
    var data_collection = data_collection_array[data_collection_array.length-1];
    var name = name_array[name_array.length - 1];
    var txt = document.getElementById('Print_TotalBalances').innerHTML;
    var txt_balance = PrintHTML_TotalBalances(name, data_collection);
    txt = txt + txt_balance;
    document.getElementById('Print_TotalBalances').innerHTML = txt;
  }
  
function PrintHTML_Accounts(name, data_collection)
{
    var txt =""; 
    
    // ------------------------- ACCOUNT DETAILS WITH AGE ----------------------------------------------//
    //txt = txt + "<div class=\"row border border-white\">";
    //txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:#e6e6ff;\"><h5>Account Details with Age</h5></div>";
    //txt = txt + "</div><hr>"; 
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:white;\"></div>";
    txt = txt + "	<div class=\"col-sm-6 text-right\" style=\"background-color:white;\"><h5>" + name + "</h5></div>";
    txt = txt + "</div><hr>";    
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-1 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Age</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>OA</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>SA</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>MA</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>RA</b></div>";
    txt = txt + "	<div class=\"col-sm-3 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Total</b></div>";
    txt = txt + "</div>";    
    
    for(var i in data_collection)
    {
        var oa = data_collection[i]["OA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var sa = data_collection[i]["SA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var ma = data_collection[i]["MA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var ra = data_collection[i]["RA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tot = data_collection[i]["OA"][3]+data_collection[i]["SA"][3]+data_collection[i]["MA"][3]+data_collection[i]["RA"][3];
        var total = tot.toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        txt = txt + "<div class=\"row border border-white\">";
        txt = txt + "	<div class=\"col-sm-1 text-center border border-light\" style=\"background-color:#f2f2f2;\">" + data_collection[i]["age"] + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + oa + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + sa + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + ma + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + ra + "</div>";
        txt = txt + "	<div class=\"col-sm-3 text-right border border-light\" style=\"background-color:white;\">" + total + "</div>";
        txt = txt + "</div>";    
    }    
    txt = txt + "</div><hr>"; 
    
    return txt;
}

function PrintHTML_Individual(name, data_collection)
{
    var txt ="\
	<div class=\"row\">\
    	<div class=\"col-sm-12 text-center\" style=\"background-color:white;\"><h4>Individual Account Components with Age</h4></div>\
	</div>\
	<hr></hr>"; 
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:white;\"></div>";
    txt = txt + "	<div class=\"col-sm-6 text-right\" style=\"background-color:white;\"><h5>" + name + "</h5></div>";
    txt = txt + "</div><hr>";    
    
    //-----------------INDIVIDUAL ACCOUNT DETAILS WITH AGE -------------------------------//   
    // Ordinary Account
    //txt = txt + "<div class=\"row border border-white\">";
    //txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:#e6e6ff;\"><h5>Individual Account Details with Age</h5></div>";
    //txt = txt + "</div><hr>"; 
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:white;\"></div>";
    txt = txt + "	<div class=\"col-sm-6 text-right\" style=\"background-color:white;\"><h6>Ordinary Account</h6></div>";
    txt = txt + "</div><hr>";    
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Age</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Contribution</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Deduction</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Interest</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Transfers</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Total</b></div>";
    txt = txt + "</div>";    
    
    for(var i in data_collection)
    {
        var con = data_collection[i]["OA"][0].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var ded = data_collection[i]["OA"][1].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var int = data_collection[i]["OA"][2].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tfr = data_collection[i]["OA"][4].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tot = data_collection[i]["OA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        
        txt = txt + "<div class=\"row border border-white\">";
        txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:#f2f2f2;\">" + data_collection[i]["age"] + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + con + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + ded + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + int + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tfr + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tot + "</div>";
        txt = txt + "</div>";    
    }
    txt = txt + "<hr>";
    
    // Special Account    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:white;\"></div>";
    txt = txt + "	<div class=\"col-sm-6 text-right\" style=\"background-color:white;\"><h6>Special Account</h6></div>";
    txt = txt + "</div><hr>";    
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Age</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Contribution</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Deduction</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Interest</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Transfers</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Total</b></div>";
    txt = txt + "</div>";    
    
    for(var i in data_collection)
    {
        var con = data_collection[i]["SA"][0].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var ded = data_collection[i]["SA"][1].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var int = data_collection[i]["SA"][2].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tfr = data_collection[i]["SA"][4].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tot = data_collection[i]["SA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        
        txt = txt + "<div class=\"row border border-white\">";
        txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:#f2f2f2;\">" + data_collection[i]["age"] + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + con + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + ded + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + int + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tfr + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tot + "</div>";
        txt = txt + "</div>";    
    }
    txt = txt + "<hr>";
    
    // Medisave Account    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-6\" style=\"background-color:white;\"></div>";
    txt = txt + "	<div class=\"col-sm-6 text-right\" style=\"background-color:white;\"><h6>Medisave Account</h6></div>";
    txt = txt + "</div><hr>";    
    
    txt = txt + "<div class=\"row border border-white\">";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Age</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Contribution</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Deduction</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Interest</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Transfers</b></div>";
    txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:lightgrey;\"><b>Total</b></div>";
    txt = txt + "</div>";    
    
    for(var i in data_collection)
    {
        var con = data_collection[i]["MA"][0].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var ded = data_collection[i]["MA"][1].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var int = data_collection[i]["MA"][2].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tfr = data_collection[i]["MA"][4].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        var tot = data_collection[i]["MA"][3].toLocaleString("en-SG",{style:"currency", currency:"SGD"});
        
        txt = txt + "<div class=\"row border border-white\">";
        txt = txt + "	<div class=\"col-sm-2 text-center border border-light\" style=\"background-color:#f2f2f2;\">" + data_collection[i]["age"] + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + con + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + ded + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:ghostwhite;\">" + int + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tfr + "</div>";
        txt = txt + "	<div class=\"col-sm-2 text-right border border-light\" style=\"background-color:white;\">" + tot + "</div>";
        txt = txt + "</div>";    
    }
    txt = txt + "<hr>";
    //-----------------INDIVIDUAL ACCOUNT DETAILS WITH AGE -------------------------------//
    
    return txt;
}

function Print_TotalBalances()
{
    var data_collection = data_collection_array[data_collection_array.length-1];
    var name = name_array[name_array.length - 1];
    
    var txt = document.getElementById('Print_TotalBalances').innerHTML;
    var txt_balance = PrintHTML_TotalBalances(name, data_collection);
    txt = txt + txt_balance;
    
    document.getElementById('Print_TotalBalances').innerHTML = txt;
}

function Print_Accounts()
{
    var data_collection = data_collection_array[data_collection_array.length-1];
    var name = name_array[name_array.length - 1];
    
    var txt = document.getElementById('Print_Accounts').innerHTML;
    var txt_balance = PrintHTML_Accounts(name, data_collection);
    // txt = txt + txt_balance;
    txt = txt_balance;
    
    document.getElementById('Print_Accounts').innerHTML = txt;
}

function Print_Individual()
{
    var data_collection = data_collection_array[data_collection_array.length-1];
    var name = name_array[name_array.length - 1];
    
    var txt = document.getElementById('Print_Individual').innerHTML;
    var txt_balance = PrintHTML_Individual(name, data_collection);
    //txt = txt + txt_balance;
    txt = txt_balance;
    
    document.getElementById('Print_Individual').innerHTML = txt;
}
  
  // The main “RunSimulation” button callback
  function RunSimulation() {
    data_collection_array = [];
    name_array = [];
  
    // Clear existing charts so that each run is fresh
    if (chart_doughnut1 != null) { chart_doughnut1.destroy(); chart_doughnut1 = null; }
    if (chart_doughnut2 != null) { chart_doughnut2.destroy(); chart_doughnut2 = null; }
    if (chart_total_balances != null) {
      chart_total_balances.data.datasets = [];
      chart_total_balances.update();
    }
    if (chart_total_accounts != null) {
      chart_total_accounts.data.datasets = [];
      chart_total_accounts.update();
    }
    document.getElementById("analysis_area").style.display = "none";
  
    // Create empty charts if not present
    CreateChart_TotalBalances();
    CreateChart_TotalAccounts();
  
    // Run the core simulation
    Simulate();
  
    // Plot line charts
    DrawChart_TotalBalances();
    DrawChart_TotalAccounts();
  
    // Update final 55/65 card displays
    Print_TotalBalances_New();
  
    // Show table prints
    Print_Accounts();
    // Print_Individual();
  
    // Show final area
    document.getElementById("analysis_area").style.display = "block";
    document.getElementById('chart_TOTAL_BALANCES').style.display = "block";
    document.getElementById('chart_TOTAL_ACCOUNTS').style.display = "block";
    document.getElementById('doughnut_TOTAL_BALANCES_55').style.display = "block";
    document.getElementById('doughnut_TOTAL_BALANCES_65').style.display = "block";
  }
  
  // Reset everything
  function ClearAll() {
    data_collection_array = [];
    name_array = [];
    if (chart_doughnut1 != null) { chart_doughnut1.destroy(); chart_doughnut1 = null; }
    if (chart_doughnut2 != null) { chart_doughnut2.destroy(); chart_doughnut2 = null; }
    if (chart_total_balances != null) { chart_total_balances.destroy(); chart_total_balances = null; }
    if (chart_total_accounts != null) { chart_total_accounts.destroy(); chart_total_accounts = null; }
    document.getElementById("analysis_area").style.display = "none";
  }
  
  // Toggle extra info
  function CollapseInfo() {
    var d = document.getElementById('collapseExample').style.display;
    document.getElementById('collapseExample').style.display = (d === "none") ? "block" : "none";
  }
  function CollapseInfo2() {
    var d = document.getElementById('collapseExample2').style.display;
    document.getElementById('collapseExample2').style.display = (d === "none") ? "block" : "none";
  }
  