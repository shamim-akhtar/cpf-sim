# CPF Simulator

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

A responsive web-based CPF Simulator designed to calculate projected CPF balances based on user inputs. Built using HTML, JavaScript, Bootstrap, and Chart.js. 

>[!IMPORTANT]
>Important Note**
This CPF Simulator is created for educational purposes only and serves as a tool to help users approximate their projected CPF balances over time. The calculations used in this simulator are based on publicly available information and general assumptions about CPF contributions, interest rates, and account limits.
>
>While this simulator aims to provide useful estimates, it is not a substitute for official CPF statements or professional financial advice. Always refer to your official CPF account or consult a financial advisor for accurate and personalized financial planning.

>**Benefit to Users:** This simulator helps you visualize your CPF growth over time, understand how different contributions and interest rates impact your balances, and make better-informed decisions about your retirement planning.

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

## 🚀 Live Demo
Check out the live version of the CPF Simulator here: [CPF Simulator](https://YourUsername.github.io/CPF-Simulator/)

## 📌 Usage
1. Clone this repository or download the files.
2. Open `index.html` in your browser.
3. Adjust the parameters and run simulations as desired.

## 📜 License
This project is licensed under the MIT License. Feel free to modify and distribute as you wish.

---

### 📧 Contact
Found an issue? Have a suggestion? Feel free to open an issue or reach out!


