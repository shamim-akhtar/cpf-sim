# CPF Simulator
This is a CPF Simulator that simulates the CPF accounts based on publicly available information. You can use this simulator to optimize your CPF account outputs by comparing and contrasting across multiple simulation runs.

You can run the CPF simulator multiple times with different names and different inputs and then you can compare the account outputs based on the inputs you keyed in.

![Total Account Balance](https://octodex.github.com/images/yaktocat.png)

**Disclaimer**

*I am not a financial advisor. Neither am I trying to sell you anything. This CPF simulator is for educational purposes. The calculations used in this simulator are derived from publicly available information. It projects the CPF account amounts based on the inputs you provide. No data is retained for the working of the simulator. The entire calculation takes place on the browser and no data is sent to the server. Do note that this is the first version of the CPF Simulator and I am still testing on it. If you find any problem or flaws please send me a note either via comments or via email.*

## How to Use The CPF Simulator
### Basic Inputs
In this section, you key in some basic parameters needed for the simulation. This includes:

- Simulation Name: You provide a name for your simulation. For example, you can name a simulation as My CPF – No OA to SA TFR and run the simulation. Then you can change the name to My CPF – OA to SA TFR and then again run the simulation. In this simulation, you check the checkbox Allow OA to SA Transfer in the form. Thereafter, you can again change the name of the simulation to My CPF – OA to SA TFR – Cash Topup 200. In this simulation, you key in 200 as monthly cash top-up into your CPF special account (until it reaches the Full Retirement Sum – FRS). You can do this as many times as you wish.
- **Age:** Enter your current age.
- **Salary:** Enter your current salary. For simplicity, we do not consider any increase in salary for this version of the CPF simulator.
- **Bonus:** Enter the expected number of months as bonus inputs. By default, the CPF simulator will take in 1 month as a bonus for AWS.
- **Monthly Top-up:** Enter the amount you would want to do as a monthly cash top-up to your special account. This will only take into effect as long as your special account does not reach the FRS. For more information on retirement sum cash top-up refer to Retirement Sum Topping-Up Scheme from CFP Board.

### Starting Account Balance
In this section, you enter your starting balances. This information can be found in your CPF account.

- **Ordinary Account:** Enter your starting Ordinary Account amount.
- **Special Account:** Enter your starting Special Account amount.
- **Medisave Account:** Enter your starting Medisave Account amount.

### BHS & FRS Rates of Increase
In this section, you enter the expected growth rate of Basic Healthcare Sum (BHS) and the Full Retirement Sum (FRS). A growth rate of 3% is a good choice. For more information on BHS and FRS refer to CPF official documentation. You can also read [CPF Medisave: Here’s How Your Basic Healthcare Sum Might Look Like When You’re 65](https://dollarsandsense.sg/cpf-medisave-heres-basic-healthcare-sum-might-look-like-youre-55/) By default the values are zero per cent. This means that there is no increase in FRS and BHS. For the CPF simulator, the values for BHS and FRS are $63,000 and $186,000 respectively.

### Deductions
In this section, you will key in the deductions from your CPF accounts. Typically this will be for housing, Medishield premium, ElderShield premium, Dependent Protection Scheme (DPS) premium and Home Protection Scheme (HPS) premium. By default, all these values are set to zero. You can change this and key in the exact amount and the month when it is deducted from your CPF.

### Allow OA to SA Transfer
Finally, indicate whether or not you would allow the CPF simulator to automatically transfer your ordinary account balance to your special account until your FRS is reached. You can compare your CPF outputs based on allowed or not allowed settings. Try yourself and see the various outputs by the simulator. By default, this value is set to false.

### Assumptions

- Bonus is added in the first month of the year.
- The additional 1% and extra additional 1% interest given by the government is not taken into the calculation.
- Interests are calculated on a monthly basis but added only at the end of the year.
- Once MA reaches BHS limit and age is less than 55 the contributions to Medisave and interests from Medisave are transferred to SA. If SA reached FRS limit then the amounts are transferred to OA.
- Once MA reaches BHS limit and age is more than 55 the contributions to Medisave and interests from Medisave are transferred to RA. If RA reached FRS limit then the amounts are transferred to OA

**Have fun with the simulator. Do leave your comments.**

This CPF simulator can be a very useful tool for planning your CPF by changing the variables that are within your control. These variables include housing mortgage payment from CPF, transferring balances from Ordinary Account to Special Account and cash top-ups. With proper CPF planning a million dollars in your CPF is not a far fetched goal!
