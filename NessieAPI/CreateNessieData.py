# add params to create functions
# description populate dataset account balance by average

import requests
import json
from random import randint

apiKey = 'b86dd9297128e1a6a6b8e0821692d691'
#customerId = "5877afed1756fc834d8e878f" #if want to just create acc, not updated
#accountId = 0
monthlySpentDict = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}
monthlyBalancesDict = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}

firstName = "first"
lastName = "last"
streetNumber = "4000"
streetName = "Stadium Dr."
city = "College Park"
state = "MD"
zipAddress = "20742"
isNewCustomer = True
aproxLeftover = 10000

def extractMonth(date):
	if (date[6:7] is '-'):
		return date[5:6]
	else:
		return date[5:7]

def getDistributedDate():
	month = randint(1,12)
	if (month is 2):
		return '2016-' + str(month) + '-' + str(randint(1,28))
	elif (month is 4 or month is 6 or month is 9 or month is 11):
		return '2016-' + str(month) + '-' + str(randint(1,30))
	else:
		return '2016-' + str(month) + '-' + str(randint(1,31))

def populateMonthlyBalancesDict():
	decrementerBalance = balance
	for x in range(len(monthlySpentDict)):
		decrementerBalance -= monthlySpentDict[str(x+1)]
		monthlyBalancesDict[str(x+1)] = decrementerBalance

def createCustomer(firstName, lastName, streetNumber, streetName, city, state, zipAddress):
	url = 'http://api.reimaginebanking.com/customers?key={}'.format(apiKey)
	payload = {
		"first_name": str(firstName),
		"last_name": str(lastName),
		"address": {
		"street_number": str(streetNumber),
		"street_name": str(streetName),
		"city": str(city),
		"state": str(state),
		"zip": str(zipAddress)
		}
	}
	response = requests.post(
		url,
		data=json.dumps(payload),
		headers={'content-type':'application/json'},
		)
	if response.status_code == 201:
		print('customer created')
		global customerId
		customerId = response.json()['objectCreated']['_id']
		print(response.json())
	else:
		print(response.status_code)

def createAccount(balance, id):
	url = 'http://api.reimaginebanking.com/customers/{}/accounts?key={}'.format(id, apiKey)
	payload = {
		"type": "Credit Card",
		"nickname": "string",
		"rewards": 0,
		"balance": balance,
		"account_number": "5105105105105101"
	}
	response = requests.post(
		url,
		data=json.dumps(payload),
		headers={'content-type':'application/json'},
		)
	if response.status_code == 201:
		print('account created')
		print(response.json())
		global accountId
		accountId = response.json()['objectCreated']['_id']
		print(accountId)
	else:
		print(response.status_code)

#function does not keep track of merchant id
def addPurchase(accountId, amount, date):
	url = 'http://api.reimaginebanking.com/accounts/{}/purchases?key={}'.format(accountId, apiKey)
	payload = {
		"merchant_id": "57cf75cea73e494d8675ec49",
		"medium": "balance",
		"purchase_date": date,
		"amount": amount,
		"description": "all dunkin purchases"
	}
	response = requests.post(
		url,
		data=json.dumps(payload),
		headers={'content-type':'application/json'},
		)
	if response.status_code == 201:
		print(str(amount) + ' ' + date)
		monthlySpentDict[extractMonth(date)] += amount
	else:
		print(response.status_code)

def populatePurchasesYear(accountId, aproxLeftover):
	balance = 19000
	while (balance > aproxLeftover):
		purchaseAmount = randint(2,10)
		date = getDistributedDate()

		addPurchase(accountId, purchaseAmount, date)
		balance -= purchaseAmount
		#print(date + ' ' + str(balance) + ' ' + str(purchaseAmount))

def createDataset():
	if(isNewCustomer):
		createCustomer(firstName, lastName, streetNumber, streetName, city, state, zipAddress)
	createAccount(19000, customerId)
	populatePurchasesYear(accountId, 10000)

def main():
	if (isNewCustomer):
		createCustomer(firstName, lastName, streetNumber, streetName, city, state, zipAddress)
	createAccount(balance, customerId)
	populatePurchasesYear(accountId, 10000)
	print('complete')

if __name__ == "__main__":
	main()
