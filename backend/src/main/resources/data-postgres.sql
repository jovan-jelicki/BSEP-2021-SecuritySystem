-- Sve sifre su "nekipass123"
INSERT INTO users (id, first_name, last_name, email, password, role, approved_account, token_end)
VALUES (1, 'Jovan', 'Jelicki', 'jovanjovanjovan@gmail.com', '$2a$10$Nqiae.pIzL.ww2rMu0kNS.1EcCvfsJQW0/XxK1pbd5hPIp5zi5aGe', 0, false, '2020-01-01');
INSERT INTO users (id, first_name, last_name, email, password, role, approved_account, token_end)
VALUES (2, 'Igor', 'Roncevic', 'igorigorigor@gmail.com', '$2a$10$Nqiae.pIzL.ww2rMu0kNS.1EcCvfsJQW0/XxK1pbd5hPIp5zi5aGe', 0, false, '2020-01-01');
INSERT INTO users (id, first_name, last_name, email, password, role, approved_account, token_end)
VALUES (3, 'Tamara', 'Kovacevic', 't.kovacevic98@gmail.com', '$2a$10$Nqiae.pIzL.ww2rMu0kNS.1EcCvfsJQW0/XxK1pbd5hPIp5zi5aGe', 1, false,'2020-01-01');

-- Permissions
INSERT INTO permissions(id, name) VALUES (1, 'getAllCertificates');
INSERT INTO permissions(id, name) VALUES (2, 'downloadCertificate');
INSERT INTO permissions(id, name) VALUES (3, 'getAllRootInterCertificates');
INSERT INTO permissions(id, name) VALUES (4, 'invalidateCertificate');
INSERT INTO permissions(id, name) VALUES (5, 'findAllUsersCertificate');
INSERT INTO permissions(id, name) VALUES (6, 'issueRootIntermediateCertificate');
INSERT INTO permissions(id, name) VALUES (7, 'issueEndEntityCertificate');
INSERT INTO permissions(id, name) VALUES (8, 'getCertificateChain');
INSERT INTO permissions(id, name) VALUES (9, 'isAccountApproved');
INSERT INTO permissions(id, name) VALUES (10, 'approveAccount');

-- Role Permissions -> 0 admin, 1 user
INSERT INTO role_permission(id, role, permission_id) VALUES (1, 0, 1);  -- Admin -> getAllCertificates
INSERT INTO role_permission(id, role, permission_id) VALUES (2, 0, 2);
INSERT INTO role_permission(id, role, permission_id) VALUES (3, 1, 2);  -- User i admin -> downloadCertificate
INSERT INTO role_permission(id, role, permission_id) VALUES (4, 0, 3);  -- Admin -> getAllRootInterCertificates
INSERT INTO role_permission(id, role, permission_id) VALUES (5, 0, 4);  -- Admin -> invalidateCertificate
INSERT INTO role_permission(id, role, permission_id) VALUES (6, 1, 5);  -- User -> findAllUsersCertificate
INSERT INTO role_permission(id, role, permission_id) VALUES (7, 0, 6);  -- Admin -> issueRootIntermediateCertificate
INSERT INTO role_permission(id, role, permission_id) VALUES (8, 0, 7);  -- Admin -> issueEndEntityCertificate
INSERT INTO role_permission(id, role, permission_id) VALUES (9, 0, 8);
INSERT INTO role_permission(id, role, permission_id) VALUES (10, 1, 8);  -- User i admin -> getCertificateChain
INSERT INTO role_permission(id, role, permission_id) VALUES (11, 0, 9);
INSERT INTO role_permission(id, role, permission_id) VALUES (12, 1, 9);  -- User i admin -> isAccountApproved
INSERT INTO role_permission(id, role, permission_id) VALUES (13, 0, 10);
INSERT INTO role_permission(id, role, permission_id) VALUES (14, 1, 10);  -- User i admin -> approveAccount