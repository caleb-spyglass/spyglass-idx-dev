'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState<string>('500000');
  const [downPayment, setDownPayment] = useState<string>('100000');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [usePercent, setUsePercent] = useState<boolean>(true);
  
  // Additional costs
  const [propertyTax, setPropertyTax] = useState<string>('8000');
  const [propertyTaxPercent, setPropertyTaxPercent] = useState<string>('1.6');
  const [useTaxPercent, setUseTaxPercent] = useState<boolean>(true);
  const [homeInsurance, setHomeInsurance] = useState<string>('2000');
  const [hoa, setHoa] = useState<string>('0');
  const [pmi, setPmi] = useState<string>('0');

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [principalAndInterest, setPrincipalAndInterest] = useState<number>(0);
  const [monthlyTax, setMonthlyTax] = useState<number>(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState<number>(0);
  const [monthlyHoa, setMonthlyHoa] = useState<number>(0);
  const [monthlyPmi, setMonthlyPmi] = useState<number>(0);

  useEffect(() => {
    const price = parseFloat(homePrice) || 0;
    const down = usePercent ? (price * parseFloat(downPaymentPercent)) / 100 : parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 30;
    const tax = useTaxPercent ? (price * (parseFloat(propertyTaxPercent) || 0)) / 100 : (parseFloat(propertyTax) || 0);

    // Sync property tax values
    if (useTaxPercent) {
      setPropertyTax(Math.round(tax).toString());
    } else {
      const taxPct = price > 0 ? ((parseFloat(propertyTax) || 0) / price * 100).toFixed(2) : '0';
      setPropertyTaxPercent(taxPct);
    }
    const insurance = parseFloat(homeInsurance) || 0;
    const hoaAmount = parseFloat(hoa) || 0;
    const pmiAmount = parseFloat(pmi) || 0;

    // Update down payment values
    if (usePercent) {
      setDownPayment(down.toString());
    } else {
      setDownPaymentPercent(((down / price) * 100).toFixed(1));
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    // Calculate principal and interest
    let pi = 0;
    if (monthlyRate > 0 && numPayments > 0) {
      pi = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    // Calculate monthly amounts
    const monthlyTaxAmount = tax / 12;
    const monthlyInsuranceAmount = insurance / 12;
    const monthlyHoaAmount = hoaAmount / 12;
    const monthlyPmiAmount = pmiAmount / 12;

    const totalMonthly = pi + monthlyTaxAmount + monthlyInsuranceAmount + monthlyHoaAmount + monthlyPmiAmount;

    setPrincipalAndInterest(pi);
    setMonthlyTax(monthlyTaxAmount);
    setMonthlyInsurance(monthlyInsuranceAmount);
    setMonthlyHoa(monthlyHoaAmount);
    setMonthlyPmi(monthlyPmiAmount);
    setMonthlyPayment(totalMonthly);

  }, [homePrice, downPayment, downPaymentPercent, interestRate, loanTerm, usePercent, propertyTax, propertyTaxPercent, useTaxPercent, homeInsurance, hoa, pmi]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? '' : num.toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Mortgage <span className="text-spyglass-orange">Calculator</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Calculate your monthly mortgage payments and get a clear picture of your home buying budget
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Input Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Loan Details</h2>
              
              <div className="space-y-6">
                {/* Home Price */}
                <div>
                  <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      id="homePrice"
                      value={formatNumber(homePrice)}
                      onChange={(e) => setHomePrice(e.target.value.replace(/,/g, ''))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="500,000"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setUsePercent(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !usePercent
                          ? 'bg-spyglass-orange text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Dollar Amount
                    </button>
                    <button
                      onClick={() => setUsePercent(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        usePercent
                          ? 'bg-spyglass-orange text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Percentage
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      {usePercent ? '%' : '$'}
                    </span>
                    <input
                      type="text"
                      value={usePercent ? downPaymentPercent : formatNumber(downPayment)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (usePercent) {
                          setDownPaymentPercent(value);
                        } else {
                          setDownPayment(value);
                        }
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder={usePercent ? "20" : "100,000"}
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="interestRate"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="6.5"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term
                  </label>
                  <select
                    id="loanTerm"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-6">Additional Monthly Costs</h3>
              
              <div className="space-y-6">
                {/* Property Tax */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Property Tax
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setUseTaxPercent(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !useTaxPercent
                          ? 'bg-spyglass-orange text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Dollar Amount
                    </button>
                    <button
                      onClick={() => setUseTaxPercent(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        useTaxPercent
                          ? 'bg-spyglass-orange text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Percentage
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      {useTaxPercent ? '%' : '$'}
                    </span>
                    <input
                      type="text"
                      value={useTaxPercent ? propertyTaxPercent : formatNumber(propertyTax)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (useTaxPercent) {
                          setPropertyTaxPercent(value);
                        } else {
                          setPropertyTax(value);
                        }
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder={useTaxPercent ? "1.6" : "8,000"}
                    />
                  </div>
                  {useTaxPercent && (
                    <p className="text-xs text-gray-500 mt-1">
                      = {formatCurrency(parseFloat(propertyTax) || 0)}/year
                    </p>
                  )}
                </div>

                {/* Home Insurance */}
                <div>
                  <label htmlFor="homeInsurance" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Home Insurance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      id="homeInsurance"
                      value={formatNumber(homeInsurance)}
                      onChange={(e) => setHomeInsurance(e.target.value.replace(/,/g, ''))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="2,000"
                    />
                  </div>
                </div>

                {/* HOA */}
                <div>
                  <label htmlFor="hoa" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual HOA Fees
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      id="hoa"
                      value={formatNumber(hoa)}
                      onChange={(e) => setHoa(e.target.value.replace(/,/g, ''))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* PMI */}
                <div>
                  <label htmlFor="pmi" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual PMI
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      id="pmi"
                      value={formatNumber(pmi)}
                      onChange={(e) => setPmi(e.target.value.replace(/,/g, ''))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="bg-spyglass-charcoal text-white rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Monthly Payment</h2>
                <div className="text-center">
                  <div className="text-5xl font-bold text-spyglass-orange mb-2">
                    {formatCurrency(monthlyPayment)}
                  </div>
                  <div className="text-gray-300">Total Monthly Payment</div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(principalAndInterest)}</span>
                  </div>
                  {monthlyTax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(monthlyTax)}</span>
                    </div>
                  )}
                  {monthlyInsurance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Home Insurance</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(monthlyInsurance)}</span>
                    </div>
                  )}
                  {monthlyHoa > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">HOA Fees</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(monthlyHoa)}</span>
                    </div>
                  )}
                  {monthlyPmi > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">PMI</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(monthlyPmi)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Monthly</span>
                      <span className="font-bold text-spyglass-orange text-lg">{formatCurrency(monthlyPayment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(homePrice) - parseFloat(downPayment))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(downPayment))} ({downPaymentPercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest Paid</span>
                    <span className="font-semibold">{formatCurrency((principalAndInterest * parseFloat(loanTerm) * 12) - (parseFloat(homePrice) - parseFloat(downPayment)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid Over {loanTerm} Years</span>
                    <span className="font-semibold">{formatCurrency(principalAndInterest * parseFloat(loanTerm) * 12)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Note</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This calculator provides estimates only and should not be relied upon for financial planning. 
              Actual loan terms, interest rates, and monthly payments may vary based on your credit score, 
              debt-to-income ratio, and lender requirements. Please consult with a qualified mortgage 
              professional for personalized advice and accurate loan calculations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Home Search?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Now that you know your budget, let's find your perfect Austin home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Search Homes
            </a>
            <a 
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Pre-Approved
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}