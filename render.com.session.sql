delete from classification where classification_name = 'Boats'

select * from classification

delete from wishlist

select * from account

UPDATE account
SET account_type = 'Employee'
WHERE account_email = 'happy@340.edu';

UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';

SELECT account_firstname, account_email, account_type FROM account;


SELECT * from inventory

SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = 'manager@340.edu';

SELECT* FROM wishlist 