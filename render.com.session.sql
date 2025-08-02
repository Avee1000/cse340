delete from classification where classification_name = 'Bikes'

select * from classification

delete from account

select * from account

UPDATE account
SET account_type = 'Employee'
WHERE account_email = 'happy@340.edu';

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';

SELECT account_firstname, account_email, account_type FROM account;


SELECT * from inventory