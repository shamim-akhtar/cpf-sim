# CPF Simulator

<p align='left'>
  <a href="#">
    <img src="https://visitor-badge.glitch.me/badge?page_id=cpf-sim.visitor-badge" />        
  </a>
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

This CPF Simulator simulates the CPF accounts based on publicly available information. You can use this simulator to optimize your CPF account outputs by comparing and contrasting across multiple simulation runs.

You can run the CPF simulator multiple times with different names and different inputs, and then you can compare the account outputs based on the inputs you keyed in.

## Basic Inputs
![alt text](https://faramira.com/wp-content/uploads/2022/12/1-1024x517.jpg "Basic Inputs")
In this section, you key in some basic parameters needed for the simulation. This includes:

* **Simulation Name:** You provide a name for your simulation. For example, you can name a simulation as My CPF – No OA to SA TFR and run the simulation. Then you can change the name to My CPF – OA to SA TFR and rerun the simulation. In this simulation, you check the checkbox Allow OA to SA Transfer in the form. You can change the simulation’s name from My CPF – OA to SA TFR – Cash Topup 200. In this simulation, you key in 200 as a monthly cash top-up into your CPF particular account (until it reaches the Full Retirement Sum – FRS). You can do this as many times as you wish.
* **Age:** Enter your current age.
* **Salary:** Enter your current salary. For simplicity, we do not consider any increase in salary for this version of the CPF simulator.
* **Bonus:** Enter the expected number of months as bonus inputs. The CPF simulator will, by default, take 1 month as a bonus for AWS.
* **Monthly Top-up:** Enter the amount you want to do as a monthly cash top-up to your special account. This will only take effect if your special account does not reach the FRS. For more information on retirement sum cash top-up, refer to Retirement Sum Topping-Up Scheme from CFP Board.

## Starting Account Balance

![alt text](https://faramira.com/wp-content/uploads/2022/12/2-1-1024x387.jpg "Starting Account Balance")
In this section, you enter your starting balances. This information can be found in your CPF account.

* **Ordinary Account:** Enter your starting Ordinary Account amount.
* **Special Account:** Enter your starting Special Account amount.
* **Medisave Account:** Enter your starting Medisave Account amount.

## BHS & FRS Rates of Increase

![alt text](https://faramira.com/wp-content/uploads/2022/12/3-1024x369.jpg "BHS & FRS Rates of Increase")
In this section, you enter the expected growth rate of the Basic Healthcare Sum (BHS) and the Full Retirement Sum (FRS). A growth rate of 3% is a good choice. For more information on BHS and FRS, refer to CPF’s official documentation. You can also read “CPF Medisave: Here’s How Your Basic Healthcare Sum Might Look Like When You’re 65” By default, the values are zero per cent. This means that there is no increase in FRS and BHS. For the CPF simulator, the values for BHS and FRS are $68,500 and $198,800, respectively (updated as of 2023).

## Deductions

![alt text](https://faramira.com/wp-content/uploads/2022/12/4-1024x607.jpg "Deductions")

In this section, you will key in the deductions from your CPF accounts. Typically this will be for housing, Medishield premium, ElderShield premium, Dependent Protection Scheme (DPS) premium and Home Protection Scheme (HPS) premium. By default, all these values are set to zero. You can change this and key in the exact amount, and the month it is deducted from your CPF.

## Allow OA to SA Transfer
![alt text](https://faramira.com/wp-content/uploads/2022/12/5-1024x384.jpg "Allow OA to SA Transfer")

Finally, indicate whether or not you would allow the CPF simulator to automatically transfer your ordinary account balance to your special account until your FRS is reached. You can compare your CPF outputs based on allowed or not allowed settings. Try yourself and see the various outputs of the simulator. By default, this value is set to false.

## Results
![alt text](https://raw.githubusercontent.com/shamim-akhtar/cpf-sim/main/res1.JPG "Results 1")
![alt text](https://raw.githubusercontent.com/shamim-akhtar/cpf-sim/main/res2.JPG "Results 1")

## Assumptions

* Bonus is added in the first month of the year.
* The additional 1% interest given by the government is not calculated.
* Interests are calculated monthly but added only at the end of the year.
* Once MA reaches the BHS limit, and the age is less than 55, the contributions to Medisave and interests from Medisave are transferred to SA. If SA reaches FR’s limit, the amounts are transferred to OA.
* Once MA reaches the BHS limit and the age is more than 55, the contributions to Medisave and interests from Medisave are transferred to RA. If RA reaches FR’s limit, the amounts are transferred to OA.

## Diclaimer
*I am not a financial advisor. Neither am I trying to sell you anything. This CPF simulator is for educational purposes. The calculations used in this simulator are derived from publicly available information. It projects the CPF account amounts based on the inputs you provide. No data is retained for the working of the simulator. The entire calculation takes place on the browser, and no information is sent to the server. If you find any problems or flaws, please send me a note via comments or email.*
