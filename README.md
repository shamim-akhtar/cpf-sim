# CPF Simulator
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

A responsive web-based CPF Simulator was designed to calculate projected CPF balances based on user inputs. Built using HTML, JavaScript, Bootstrap, and Chart.js. 

>[!IMPORTANT]
>Important Note**
This CPF Simulator is created for educational purposes only and serves as a tool to help users approximate their projected CPF balances over time. The calculations used in this simulator are based on publicly available information and general assumptions about CPF contributions, interest rates, and account limits.
>
>While this simulator aims to provide useful estimates, it is not a substitute for official CPF statements or professional financial advice. Always refer to your official CPF account or consult a financial advisor for accurate and personalized financial planning.

>[!TIP]
>**Benefit to Users:** This simulator helps you visualize your CPF growth over time, understand how different contributions and interest rates impact your balances, and make better-informed decisions about your retirement planning.

---

## 🌟 Features
- Calculate CPF balances up to retirement age.
- Visualize account growth using charts and tables.
- Projection of Ordinary, Special, Medisave, and Retirement Accounts.
- Customizable inputs for salary, bonuses, contributions, and interest rates.

## 📖 Assumptions
- **Bonuses** are credited in January of each year.
- The **additional 1% and extra 1% interest** provided by the government is not considered.
- **Interest** is calculated monthly but credited annually.
- **Medisave Account (MA) contributions** above the **Basic Healthcare Sum (BHS)** are handled based on age:
  - **Below 55:** Redirected to Special Account (SA). If SA exceeds **Full Retirement Sum (FRS)**, excess goes to Ordinary Account (OA).
  - **55 or Above:** Redirected to Retirement Account (RA). If RA exceeds **FRS**, excess goes to OA.
- **Special Account (SA)** contributions exceeding **FRS** are redirected to **OA** when age is below 55.

## 📂 Technologies Used
- **HTML & CSS (Bootstrap 4):** For structure and styling.
- **JavaScript:** Simulation logic and dynamic rendering.
- **Chart.js:** For visual representation of account balances.

## CPF Simulator App
Check out the live version of the CPF Simulator here: [CPF Simulator](https://shamim-akhtar.github.io/cpf-sim/)


---


## 🌟 **Step-by-Step Guide for Using the CPF Simulator**

### ✅ **Step 1: Understand the Purpose of This Tool**
The CPF Simulator is designed to help you estimate your CPF account balances over time, based on your inputs such as salary, bonuses, and account balances. It helps you make informed decisions for your financial planning, but remember – it is for educational purposes only. Always refer to your official CPF account for accurate figures.

---

### ✅ **Step 2: Open the Simulator**
1. Navigate to the page [CPF Simulator](https://shamim-akhtar.github.io/cpf-sim/)
2. The application will load and present you with the homepage that shows the title, purpose note, and input form.

---

### ✅ **Step 3: Read the Purpose Note**
1. At the top of the page, there is an information box titled "Important Note".
2. Read through this note to understand that the simulator is for educational purposes and provides approximations, not actual CPF account balances.

---

### ✅ **Step 4: Enter Basic Inputs (Basic Inputs Card)**
1. In the **Basic Inputs** section, provide the following details:
   - **Simulation Name**: Give your simulation a meaningful name (e.g., "My CPF Simulation 2025").
   - **Age**: Enter your current age. It should be between 18 and 65.
   - **Salary (SGD)**: Enter your gross monthly salary in SGD.
   - **Bonus (months)**: Enter the number of months’ worth of bonus you expect to receive each year (e.g., 1 for 1 month of bonus).
   - **Monthly Top-up**: Enter the additional top-up amount you are contributing to your CPF each month (if any).

2. Ensure all fields are filled in correctly before proceeding.

---

### ✅ **Step 5: Provide Your Starting Account Balances (Starting Account Balance Card)**
1. **Ordinary Account (OA)**: Enter the current balance in your Ordinary Account.
2. **Special Account (SA)**: Enter the current balance in your Special Account.
3. **Medisave Account (MA)**: Enter the current balance in your Medisave Account.

4. Make sure all balances are entered correctly before continuing.

---

### ✅ **Step 6: Set the Rates of Increase for BHS & FRS (BHS & FRS Rates of Increase Card)**
1. In this section, you will provide the expected growth rates for:
   - **FRS Rate**: This is the estimated yearly increase rate of the Full Retirement Sum. A good choice is between 3% to 4%.
   - **BHS Rate**: This is the estimated yearly increase rate of the Basic Healthcare Sum. 

2. Select appropriate rates from the dropdown menus for each category.

---

### ✅ **Step 7: Enter Your Deductions (Deductions Card)**
1. If you have recurring deductions from your CPF accounts, provide the details here:
   - **Housing**: Monthly deduction amount for your housing payments.
   - **DPS (Dependent Protection Scheme)**: Monthly deduction amount and select the month of deduction.
   - **HPS (Home Protection Scheme)**: Monthly deduction amount and select the month of deduction.
   - **Medishield**: Monthly deduction amount and select the month of deduction.
   - **Eldershield**: Monthly deduction amount and select the month of deduction.

2. If you do not have any deductions, you can leave these fields as zero.

---

### ✅ **Step 8: Choose Whether to Allow OA to SA Transfer (Allow OA to SA Transfer Card)**
1. Decide if you want the simulator to **automatically transfer your OA balance to SA until your FRS is reached**.
2. Select either **Yes** or **No**.
3. By default, this setting is set to **No**.

---

### ✅ **Step 9: Run the Simulation**
1. After filling in all the required information, click the **"Simulate"** button.
2. Wait for the simulation to process. This may take a few seconds depending on your inputs.

---

### ✅ **Step 10: View Your Results (Simulation Results Section)**
The results are displayed in several parts:

1. **Just before your 55th birthday:**  
   - See a breakdown of your CPF account balances just before you turn 55.
   - View a **doughnut chart** visualizing the distribution of your OA, SA, MA, and RA accounts.

2. **Just before your 65th birthday:**  
   - See a breakdown of your CPF account balances just before you turn 65.
   - View a **doughnut chart** for the distribution of accounts at this stage.

3. **Account Balance Accumulation:**  
   - Two line graphs showing the total account balances and the sum of your OA and SA balances over time.

4. **Account Balances (Detailed View):**  
   - View detailed data of your account balances year-by-year.

---

### ✅ **Step 11: Reviewing Assumptions (Assumptions Card)**
1. The **Assumptions** section explains the key assumptions made in this simulation, including:
   - Interest calculation.
   - Handling of MA exceeding BHS limits.
   - Handling of SA exceeding FRS limits.
   - How contributions are routed based on age and limits.

---

### ✅ **Step 12: Read the Disclaimer (Footer)**
1. A **disclaimer** is provided at the bottom of the page to ensure that you understand the limitations of this simulator.
2. This tool is not intended to replace official CPF calculations or professional financial advice.

---

### ✅ **Step 13: Resetting Simulations**
1. If you wish to **reset all inputs and start over**, click the **"Reset All Simulations"** button.
2. All data will be cleared, and you can begin a fresh simulation.

---

### ✅ **Step 14: Make Your Own Changes**
Feel free to adjust your inputs and try different scenarios to see how your CPF balances may vary. This simulator is a useful tool to help you understand CPF's structure and estimate your potential savings.

---




