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

