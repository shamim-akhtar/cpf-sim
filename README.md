# CPF Simulator (2026 Edition)

### 📧 Contact

Found an issue? Have a suggestion? Feel free to open an issue or reach out!

<p align='left'>
  <a href="https://www.linkedin.com/in/shamim-akhtar/">
    <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&flat-square&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:shamim.akhtar@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?flat-square&logo=gmail&logoColor=white" />        
  </a>
  <a href="https://www.facebook.com/faramiraSG/">
    <img src="https://img.shields.io/badge/Facebook-1877F2?flat-square&logo=facebook&logoColor=white" />        
  </a>
</p>

# CPF Simulator



<!-- Simulator Link Button -->
[![](https://github.com/shamim-akhtar/cpf-sim/blob/main/images/CPFSim_2026.jpg)](https://shamim-akhtar.github.io/cpf-sim/index.html)

<p align="center">
  <a href="https://shamim-akhtar.github.io/cpf-sim/">
    <img src="https://img.shields.io/badge/🚀_Launch-CPF_Simulator_2026-059669?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Launch Simulator" height="40"/>
  </a>
</p>

A modern, responsive web-based CPF Simulator designed to forecast CPF balances based on **2026 Rules** and beyond. Built using **HTML5**, **Tailwind CSS**, and **Chart.js** for a clean, single-file deployment.

> [!IMPORTANT]
> **Important Disclaimer**
>
> I am not a financial advisor. Neither am I trying to sell you anything. This CPF simulator is for educational purposes. The calculations used in this simulator are derived from publicly available information. It projects the CPF account amounts based on the inputs you provide. No data is retained for the working of the simulator. The entire calculation takes place on the browser, and no information is sent to the server. If you find any problems or flaws, please send me a note via comments or email.
>
> **2026 Rules & Logic:**
> This tool simulates **2026 rules**, including the **closure of the Special Account (SA) at age 55**.
>
> * **Monthly OW Ceiling:** $8,000
>
> * **Total Annual Wage Ceiling:** $102,000
>
> * **Contribution Limit:** Strictly capped at **$37,740** per year (Mandatory + Voluntary).

> [!TIP]
> **Benefit to Users:** Visualize the impact of the **SA Closure**, understand how **MA overflow** works under new rules, and estimate your **CPF LIFE** payouts based on your projected Retirement Account (RA) balance at age 55.

---

## 📊 Visual Guide: How It Works

We have included a detailed visual breakdown of the fund flow logic, specifically focusing on the Age 55 SA Closure event and overflow rules.

<a href="https://shamim-akhtar.github.io/cpf-sim/infographic.html">
  <img src="https://img.shields.io/badge/View-Logic_Infographic-3b82f6?style=flat-square&logo=gitbook&logoColor=white" alt="View Infographic" />
</a>

*Click the badge above or open `https://shamim-akhtar.github.io/cpf-sim/infographic.html` to see the flow chart.*

---

## 🌟 New Features (2026 Edition)

* **SA Closure Logic:** Simulates the closure of the Special Account at age 55, transferring funds to the Retirement Account (RA) up to the FRS/ERS, with the remainder transferring to the Ordinary Account (OA).

* **ERS Top-Up Option:** A new toggle allows users to simulate topping up the RA to the **Enhanced Retirement Sum (ERS)** (2x FRS) at age 55, instead of the standard Full Retirement Sum (FRS).

* **Strict Contribution Caps:** Automatically caps total contributions (Mandatory Salary/Bonus + Voluntary Cash) at the annual limit of **$37,740**, preventing unrealistic projections.

* **Detailed Ledger:** A transaction-level table showing annual breakdown of interest earned, contributions, and specific notes on fund transfers (e.g., `MA>SA`, `SA>RA`, `Int` crediting).

* **Advanced Deductions:** Granular control over monthly deductions including Housing, MediShield, ElderShield, DPS, and HPS.

* **Payout Estimator:** Provides an approximate monthly CPF LIFE payout range starting at age 65, calculated based on the RA sum accumulated at age 55.

## 📖 Key Assumptions & Logic

1. **Salary Ceilings (2026):**
   * Ordinary Wage (OW) capped at **$8,000/month**.
   * Additional Wage (Bonus) capped based on the formula: `$102,000 - (Total Annual OW)`.

2. **Interest Rates & Crediting:**
   * Base rates used: OA (2.5%), SA/MA/RA (4.0%).
   * **Compound Interest:** Interest is calculated monthly but credited annually at the end of the year.
   * *Note:* Extra interest tiers (e.g., extra 1% on first $60k) are excluded to provide a conservative estimate.

3. **Overflow Logic:**
   * **MA > BHS:** Excess flows to **SA** (if below 55) or **RA** (if above 55). If those accounts are full (FRS reached), excess flows to **OA**.

4. **SA Closure (Age 55):**
   * RA is created.
   * SA balance transfers to RA (up to FRS/ERS).
   * OA balance transfers to RA (if SA was insufficient).
   * Remaining SA balance transfers to OA.
   * SA is closed (Balance = 0). Future SA contributions are routed to RA.

## 📂 Technologies Used

* **HTML5:** Semantic structure.
* **Tailwind CSS:** Modern, utility-first styling for a responsive layout.
* **JavaScript (Vanilla):** Core simulation logic (no jQuery dependency).
* **Chart.js:** Interactive line and doughnut charts for visual data representation.

---

## 🌟 **Step-by-Step Guide**

### ✅ **Step 1: Profile & Income**
In the left sidebar, enter your current details:
* **Age:** Your current age.
* **Bonus:** Number of months of bonus (credited in January).
* **Monthly Gross Salary:** Capped automatically at $8,000 for calculation.

### ✅ **Step 2: Current Balances**
Enter your current CPF account balances for **OA**, **SA**, and **MA**.

### ✅ **Step 3: Projections & Options**
* **Growth Rates:** Set your expected yearly growth rates for FRS and BHS (defaults to 3.5% and 4.0%).
* **Target ERS at 55?**: Check this toggle if you intend to set aside the **Enhanced Retirement Sum** (2x FRS) at age 55. If unchecked, the simulator defaults to the Full Retirement Sum (FRS).

### ✅ **Step 4: Contributions & Deductions (Advanced)**
Toggle the **"Show Advanced"** checkbox to reveal detailed input fields:
* **Voluntary Cash:** Monthly cash top-ups (automatically limited by the remaining Annual Limit headroom).
* **Housing Deduction:** Monthly mortgage payments paid via OA.
* **Insurance Premiums:** Specify annual amounts and deduction months for MediShield, ElderShield, DPS, and HPS.
* **OA to SA Transfer:** Enable auto-transfer of OA funds to SA (pre-55) to maximize interest.

### ✅ **Step 5: Run Simulation**
Click **Run Simulation**. The results on the right will update instantly.

### ✅ **Step 6: Analyze Results**
* **Snapshot Cards:** View your exact balances at **Age 55** (SA Closure event) and **Age 65** (Payout eligibility).
* **Financial Summary:** Read a detailed textual analysis of your retirement readiness, including whether you met the FRS/ERS and your estimated monthly payout range.
* **Detailed Ledger:** Scroll down to the table to see year-by-year entries, verifying interest crediting (`Int`) and fund transfers.

---

### Disclaimer
*This tool is for educational purposes only. It is not financial advice. Calculations are based on 2026 CPF rules (including SA closure at 55). Limits: Monthly OW Ceiling is $8,000. Total Annual Wage Ceiling is $102,000. Contribution Limit: Strictly capped at $37,740 (Mandatory + Voluntary). Actual CPF interest rates, limits, and policies may differ. Always refer to the official CPF Board website for the most accurate and up-to-date information.*