// Helper functions
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
  
  const RetirementAge = 65;
  // As of 2024
  const CONST_SALARY_CAP = 6800.0;
  
  function getAllocationRate(age) {
    if (age < 35) return [0.23, 0.06, 0.08];
    if (age >= 35 && age < 45) return [0.21, 0.07, 0.09];
    if (age >= 45 && age < 50) return [0.19, 0.08, 0.10];
    if (age >= 50 && age < 55) return [0.15, 0.115, 0.105];
    if (age >= 55 && age < 60) return [0.12, 0.085, 0.105];
    if (age >= 60 && age < 65) return [0.035, 0.08, 0.105];
    if (age >= 65 && age < 70) return [0.01, 0.05, 0.105];
    if (age >= 70) return [0.01, 0.01, 0.105];
  }
  
  function getContrib(age, sal) {
    var allocRate = getAllocationRate(age);
    return [
      sal > CONST_SALARY_CAP ? allocRate[0] * CONST_SALARY_CAP : allocRate[0] * sal,
      sal > CONST_SALARY_CAP ? allocRate[1] * CONST_SALARY_CAP : allocRate[1] * sal,
      sal > CONST_SALARY_CAP ? allocRate[2] * CONST_SALARY_CAP : allocRate[2] * sal,
      0.0
    ];
  }
  
  var logtext = "";
  var WRITE_LOG = true;
  function log(v) {
    if (WRITE_LOG) {
      logtext += v + "<br>";
    }
  }
  
  var data_collection_array = [];
  var name_array = [];
  var chart_total_balances = null;
  var chart_total_accounts = null;
  var chart_doughnut1 = null;
  var chart_doughnut2 = null;
  
  function MAToSATransfer(age, balance, currentBHS, currentFRS, tfr) {
    if (balance[2] > currentBHS) {
      var amt = balance[2] - currentBHS;
      if (age < 55) {
        if (balance[1] < currentFRS) {
          // Transfer to special account.
          balance[1] += amt;
          balance[2] -= amt;
          tfr[1] += amt;
          tfr[2] -= amt;
          if (balance[1] > currentFRS) {
            // More than FRS amount, transfer to ordinary account.
            amt = balance[1] - currentFRS;
            balance[1] = currentFRS;
            balance[0] += amt;
            tfr[1] -= amt;
            tfr[0] += amt;
          }
        } else {
          // Transfer to ordinary.
          balance[0] += amt;
          balance[2] -= amt;
          tfr[0] += amt;
          tfr[2] -= amt;
        }
      } else {
        if (balance[3] < currentFRS) {
          // Transfer to retirement account.
          balance[3] += amt;
          balance[2] -= amt;
          tfr[3] += amt;
          tfr[2] -= amt;
          if (balance[3] > currentFRS) {
            // More than FRS amount, transfer to ordinary account.
            amt = balance[3] - currentFRS;
            balance[3] = currentFRS;
            balance[0] += amt;
            tfr[3] -= amt;
            tfr[0] += amt;
          }
        } else {
          // Transfer to ordinary.
          balance[0] += amt;
          balance[2] -= amt;
          tfr[0] += amt;
          tfr[2] -= amt;
        }
      }
    }
  }
  
  function Simulate() {
    var myform = document.getElementById('simulator-form');
    // Get the inputs.
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
  
    function getProjectedValues(currentAge, currentBHS, currentFRS, numberOfYears, bhsRate, frsRate, allow) {
      var data_collection = [];
      var balance = [START_OA, START_SA, START_MA, 0];
      var age = currentAge;
      var RetirementAgeLocal = numberOfYears + currentAge;
      while (age <= RetirementAgeLocal) {
        currentBHS = currentBHS * (1 + bhsRate);
        if (age < 55) {
          currentFRS = currentFRS * (1 + frsRate);
        }
        var con = [0, 0, 0, 0];
        var ded = [0, 0, 0, 0];
        var int = [0, 0, 0, 0];
        var tfr = [0, 0, 0, 0];
        var bon = [BONUS_MONTHS, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var hse = HOUSING;
        var med = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var dps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var hps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var eds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        med[MEDISHIELD_M] = MEDISHIELD;
        eds[ELDERSHIELD_M] = ELDERSHIELD;
        dps[DPS_M] = DPS;
        dps[HPS_M] = HPS;
  
        for (var m = 0; m < 12; ++m) {
            var contrib = getContrib(age, SALARY);
            if (age < 55) {
              // Before 55, contributions are applied as usual:
              balance[0] += contrib[0];
              balance[1] += contrib[1];
              balance[2] += contrib[2];
              balance[3] += contrib[3];
              
              // Top-up for SA if needed:
              if (balance[1] < currentFRS) {
                var amt = CASH;
                if (balance[1] + CASH > currentFRS) {
                  amt = balance[1] + CASH - currentFRS;
                }
                balance[1] += amt;
                tfr[1] += amt;
              }
            } else {
              // After 55, SA is closed:
              balance[0] += contrib[0];
              balance[2] += contrib[2];
              // Instead of contributing to SA, add both SA and RA parts to RA:
              balance[3] += (contrib[1] + contrib[3]);
              
              // Top-up: now apply the monthly top-up to RA:
              if (balance[3] < currentFRS) {
                var amt = CASH;
                if (balance[3] + CASH > currentFRS) {
                  amt = balance[3] + CASH - currentFRS;
                }
                balance[3] += amt;
                tfr[3] += amt;
              }
            }
            
            // Process bonus contributions similarly:
            if (bon[m] > 0) {
              var bon_count = Math.floor(bon[m]);
              for (var b = 0; b < bon_count; ++b) {
                contrib = getContrib(age, bon[m] * SALARY);
                if (age < 55) {
                  balance[0] += contrib[0];
                  balance[1] += contrib[1];
                  balance[2] += contrib[2];
                  balance[3] += contrib[3];
                } else {
                  balance[0] += contrib[0];
                  balance[2] += contrib[2];
                  balance[3] += (contrib[1] + contrib[3]);
                }
                con[0] += contrib[0];
                con[1] += contrib[1];
                con[2] += contrib[2];
                con[3] += contrib[3];
              }
              var deci = bon[m] - bon_count;
              contrib = getContrib(age, deci * SALARY);
              if (age < 55) {
                balance[0] += contrib[0];
                balance[1] += contrib[1];
                balance[2] += contrib[2];
                balance[3] += contrib[3];
              } else {
                balance[0] += contrib[0];
                balance[2] += contrib[2];
                balance[3] += (contrib[1] + contrib[3]);
              }
              con[0] += contrib[0];
              con[1] += contrib[1];
              con[2] += contrib[2];
              con[3] += contrib[3];
            }
            
            // Process deductions and transfers:
            // (Housing, DPS, HPS, Medishield, Eldershield deductions remain the same)
            
            // Note: the OA-to-SA transfer logic is only applicable before 55.
            if (age < 55 && ALLOW_OA_SA_TFR) {
              if (balance[1] < currentFRS) {
                var amt = balance[0];
                if (balance[1] + balance[0] > currentFRS) {
                  amt = balance[1] + balance[0] - currentFRS;
                }
                balance[1] += amt;
                tfr[1] += amt;
                balance[0] -= amt;
                tfr[0] -= amt;
              }
            }
            
            // For transfer from MA to SA/RA, the existing MAToSATransfer logic already
            // distinguishes between age < 55 and age >= 55.
            MAToSATransfer(age, balance, currentBHS, currentFRS, tfr);
            
            // Calculate monthly interests for each account.
            var oa_int = balance[0] * 0.025 / 12;
            int[0] += oa_int;
            var sa_int = (age < 55 ? balance[1] : 0) * 0.04 / 12;
            int[1] += sa_int;
            var ma_int = balance[2] * 0.04 / 12;
            int[2] += ma_int;
            var ra_int = balance[3] * 0.04 / 12;
            int[3] += ra_int;
          }
          
        // Add the interest at the end of the year.
        balance[0] += int[0];
        balance[1] += int[1];
        balance[2] += int[2];
        balance[3] += int[3];
        // Check for MA > BHS after interest.
        MAToSATransfer(age, balance, currentBHS, currentFRS, tfr);
        // Create RA at 55.
        if (age === 55) {
            // Transfer the entire SA balance to RA.
            var transferAmount = balance[1];
            if (transferAmount > 0) {
                // Close the SA account.
                balance[1] = 0;
                // If adding the entire SA amount to RA does not exceed FRS, add it all.
                if (balance[3] + transferAmount <= currentFRS) {
                    balance[3] += transferAmount;
                } 
                else {
                    // Otherwise, add only what’s needed to reach FRS, and the excess goes to OA.
                    var needed = currentFRS - balance[3];
                    if (needed > 0) {
                    balance[3] += needed;
                    balance[0] += (transferAmount - needed);
                    } else {
                    // In the unlikely event RA is already at or above FRS,
                    // send all SA funds to OA.
                    balance[0] += transferAmount;
                    }
                }
            }
            
        }
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
      }
      data_collection_array.push(data_collection);
      name_array.push(SIMULATION_NAME);
    }
  
    getProjectedValues(AGE, 71500.0, 205800, RetirementAge - AGE, BHS_RATE / 100, FRS_RATE / 100, ALLOW_OA_SA_TFR);
  }
  
  function Print_TotalBalances_New() {
    var data_collection = data_collection_array[data_collection_array.length - 1];
    var name = name_array[name_array.length - 1];
    var acc55 = [0, 0, 0, 0];
    var acc65 = [0, 0, 0, 0];
    var bhs55, bhs65, frs55;
    var oa_sa55 = 0, oa_sa65 = 0;
    var total55 = 0, total65 = 0, withdraw_amt = 0;
    for (var i in data_collection) {
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
    document.getElementById('Print_TotalBalances55').innerHTML = "You will have <b class=\"text-primary\">" +
      total55.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in your CPF accounts.<br>";
    document.getElementById('Print_TotalBalances65').innerHTML = "You will have <b class=\"text-primary\">" +
      total65.toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
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
  
    document.getElementById('Print_TotalBalances65_Details').innerHTML =
      "Your projected account balance would be <b class=\"text-danger\">" +
      acc65[0].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Ordinary Account (OA), <b class=\"text-primary\">" +
      acc65[1].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Special Account (SA), <b class=\"text-warning\">" +
      acc65[2].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) +
      "</b> in Medisave Account (MA), and <b class=\"text-info\">" +
      acc65[3].toLocaleString("en-SG", { style: "currency", currency: "SGD" }) + "</b> in Retirement Account (RA). It assumes that you did not withdraw any money from your CPF from age 55 until 65.";
    
    if (chart_doughnut1 == null) {
      chart_doughnut1 = CreateDoughnutChart(document.getElementById('doughnut_TOTAL_BALANCES_55'), acc55, ['OA', 'SA', 'MA']);
      chart_doughnut1.update();
    }
    if (chart_doughnut2 == null) {
      chart_doughnut2 = CreateDoughnutChart(document.getElementById('doughnut_TOTAL_BALANCES_65'), acc65, ['OA', 'SA', 'MA', 'RA']);
      chart_doughnut2.update();
    }
  }
  
  function CreateDoughnutChart(ctx, accdata, lbs) {
    const data = {
      labels: lbs,
      datasets: [{
        label: 'Account information',
        data: accdata,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
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
              return data.datasets[0].data[tooltipItems.index].toLocaleString("en-SG", { style: "currency", currency: "SGD" });
            }
          }
        }
      }
    };
    return new Chart(ctx, config);
  }
  
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
      var value = data_collection[i]["OA"][3] + data_collection[i]["SA"][3] +
                  data_collection[i]["MA"][3] + data_collection[i]["RA"][3];
      balances.push({ x: data_collection[i]["age"], y: toFixed(value, 2) });
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
  
  function RunSimulation() {
    data_collection_array = [];
    name_array = [];
    if (chart_doughnut1 != null) { chart_doughnut1.destroy(); chart_doughnut1 = null; }
    if (chart_doughnut2 != null) { chart_doughnut2.destroy(); chart_doughnut2 = null; }
    if (chart_total_balances != null) { chart_total_balances.data.datasets = []; chart_total_balances.update(); }
    if (chart_total_accounts != null) { chart_total_accounts.data.datasets = []; chart_total_accounts.update(); }
    document.getElementById("analysis_area").style.display = "none";
    CreateChart_TotalBalances();
    CreateChart_TotalAccounts();
    Simulate();
    DrawChart_TotalBalances();
    DrawChart_TotalAccounts();
    Print_TotalBalances_New();
    document.getElementById("analysis_area").style.display = "block";
    document.getElementById('chart_TOTAL_BALANCES').style.display = "block";
    document.getElementById('chart_TOTAL_ACCOUNTS').style.display = "block";
    document.getElementById('doughnut_TOTAL_BALANCES_55').style.display = "block";
    document.getElementById('doughnut_TOTAL_BALANCES_65').style.display = "block";
  }
  
  function ClearAll() {
    data_collection_array = [];
    name_array = [];
    if (chart_doughnut1 != null) { chart_doughnut1.destroy(); chart_doughnut1 = null; }
    if (chart_doughnut2 != null) { chart_doughnut2.destroy(); chart_doughnut2 = null; }
    if (chart_total_balances != null) { chart_total_balances.destroy(); chart_total_balances = null; }
    if (chart_total_accounts != null) { chart_total_accounts.destroy(); chart_total_accounts = null; }
    document.getElementById("analysis_area").style.display = "none";
  }
  
  function CollapseInfo() {
    var d = document.getElementById('collapseExample').style.display;
    document.getElementById('collapseExample').style.display = (d === "none") ? "block" : "none";
  }
  
  function CollapseInfo2() {
    var d = document.getElementById('collapseExample2').style.display;
    document.getElementById('collapseExample2').style.display = (d === "none") ? "block" : "none";
  }
  