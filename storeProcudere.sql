DELIMITER //
CREATE PROCEDURE getClientByDateRange(IN Inicio DATE, IN Fin DATE)
BEGIN
    SELECT c.Code,c.FirstName,c.LastName,c.Document,c.PhoneNumber,m.Name,p.Total,p.StartDate,p.EndDate,p.Due,u.FirstName
    FROM Client c
    INNER JOIN Payment p on p.clientIdClient=c.IdClient
    INNER JOIN Membreship m on p.membershipIdMembership=m.IdMembership
    INNER JOIN User u on p.userIdUser=u.IdUser
    WHERE p.DatePayment >= Inicio AND p.DatePayment <= Fin;
END//

DELIMITER ;

DELIMITER //
CREATE PROCEDURE getAttendanceByDateRange(IN Inicio DATE, IN Fin DATE)
BEGIN
    SELECT c.Code,c.FirstName,c.LastName,DATE(a.AttendanceDate) AS 'Fecha', HOUR(a.AttendanceDate) AS 'Hora', DAYNAME(a.AttendanceDate) AS 'Dia',u.UserName
    FROM Attendance a
    INNER JOIN Client c on a.IdClient=c.IdClient
    INNER JOIN User u on a.IdUser=u.IdUser
    WHERE a.AttendanceDate >= Inicio AND a.AttendanceDate <= Fin;
END//

DELIMITER ;

DELIMITER //
CREATE PROCEDURE getPaymentByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT u.UserName,CONCAT(c.FirstName,' ',c.LastName) as Name, c.Code, p.Total, p.Due,p.StartDate,p.EndDate,p.PaymentType 
	FROM Payment p 
	INNER JOIN User u on p.userIdUser=u.IdUser 
	INNER JOIN Client c on p.clientIdClient=c.IdClient 
	INNER JOIN Membreship m on p.membershipIdMembership=m.IdMembership 
	WHERE p.DatePayment >= Inicio AND p.DatePayment <= Fin; 
END//
DELIMITER ;

CALL getPaymentByDateRange('2024-07-01', '2024-07-30');


DELIMITER //
CREATE PROCEDURE getIncomeMembershipByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT 
    SUM(Due) AS 'Total deudas',
    SUM(CASE WHEN PaymentType = 'Efectivo' THEN PrePaid ELSE 0 END) AS Efectivo,
    SUM(CASE WHEN PaymentType = 'Tarjeta de crédito' THEN PrePaid ELSE 0 END) AS 'Tarjeta de Credito',
    SUM(CASE WHEN PaymentType = 'Yape' THEN PrePaid ELSE 0 END) AS Yape,
    (SUM(CASE WHEN PaymentType = 'Efectivo' THEN PrePaid ELSE 0 END) +
     SUM(CASE WHEN PaymentType = 'Tarjeta de crédito' THEN PrePaid ELSE 0 END) +
     SUM(CASE WHEN PaymentType = 'Yape' THEN PrePaid ELSE 0 END)) AS 'Ingreso Total'
    FROM Payment
    WHERE DatePayment >= Inicio AND DatePayment <= Fin; 
END//
DELIMITER ;

CALL getIncomeMembershipByDateRange('2024-07-01', '2024-07-30');

DELIMITER //
CREATE PROCEDURE getIncomeProductByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT 
	'Sin deuda' AS 'Total deudas',
    SUM(CASE WHEN TypePayment = 'Efectivo' THEN price ELSE 0 END) AS Efectivo,
    SUM(CASE WHEN TypePayment = 'Tarjeta de crédito' THEN price ELSE 0 END) AS 'Tarjeta de Credito',
    SUM(CASE WHEN TypePayment = 'Yape' THEN price ELSE 0 END) AS Yape,
    (SUM(CASE WHEN TypePayment = 'Efectivo' THEN price ELSE 0 END) +
     SUM(CASE WHEN TypePayment = 'Tarjeta de crédito' THEN price ELSE 0 END) +
     SUM(CASE WHEN TypePayment = 'Yape' THEN price ELSE 0 END)) AS 'Ingreso Total'
	FROM Cart
    WHERE CreateAt >= Inicio AND CreateAt <= Fin; 
END//
DELIMITER ;

CALL getIncomeProductByDateRange('2024-07-01', '2024-07-30');

DELIMITER //
CREATE PROCEDURE getProductSoldByDateRange(IN Inicio DATE, IN Fin DATE) 
BEGIN 
	SELECT u.UserName,c.CreateAt, p.Name,p.Price,p.Description,p.Stock,c.TypePayment
    FROM Cart c
    INNER JOIN User u on c.IdUser=u.IdUser
    INNER JOIN cart_products_product cp on c.id=cp.cartId
    INNER JOIN Product p on p.IdProduct=cp.productIdProduct
    WHERE CreateAt >= Inicio AND CreateAt <= Fin; 
END//
DELIMITER ;

CALL getIncomeProductByDateRange('2024-07-01', '2024-07-30');