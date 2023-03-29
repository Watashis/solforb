--
-- Скрипт создан в Valentina Studio
-- Домашняя страница приложения: http://www.valentina-db.com/
--

BEGIN TRANSACTION;

-- CREATE TABLE "Provider" -------------------------------------
CREATE TABLE [dbo].[Provider] ( 
	[Id] INT IDENTITY ( 1, 1 )  NOT NULL, 
	[Name] NVARCHAR( max ) NULL,
	PRIMARY KEY ( [Id] ) )
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

BEGIN TRANSACTION;

-- CREATE TABLE "Order" ----------------------------------------
CREATE TABLE [dbo].[Order] ( 
	[Id] INT IDENTITY ( 1, 1 )  NOT NULL, 
	[number] NVARCHAR( 256 ) NOT NULL, 
	[Date] DATETIME2 NOT NULL, 
	[ProviderId] INT NULL,
	PRIMARY KEY ( [Id] ) )
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

BEGIN TRANSACTION;

-- CREATE TABLE "OrderItem" ------------------------------------
CREATE TABLE [dbo].[OrderItem] ( 
	[Id] INT IDENTITY ( 1, 1 )  NOT NULL, 
	[OrderId] INT NULL, 
	[Name] NVARCHAR( max ) NULL, 
	[Quantity] DECIMAL( 18, 3 ) NULL, 
	[Unit] NVARCHAR( max ) NULL,
	PRIMARY KEY ( [Id] ) )
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

BEGIN TRANSACTION;

-- CREATE VIEW "Filters" ---------------------------------------

GO
CREATE VIEW [dbo].[Filters]
AS
SELECT
  DISTINCT name
FROM
(
    SELECT
      name
    FROM
      [provider]

        UNION
    SELECT
      number
    FROM
      [ORDER]

        UNION
    SELECT
      name
    FROM
      [OrderItem]

        UNION
    SELECT
      Quantity
    FROM
    (
        SELECT
          str( Quantity ) AS Quantity
        FROM
          OrderItem
    ) as Quantity

        UNION
    SELECT
      Unit
    FROM
    (
        SELECT
          Unit
        FROM
          OrderItem
    ) as Unit
) as name
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

BEGIN TRANSACTION;

-- CREATE VIEW "Unit" ------------------------------------------

GO
CREATE VIEW [dbo].[Unit]
AS
	select DISTINCT unit from [OrderItem]
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

SET IDENTITY_INSERT [dbo].[Provider] ON
GO
BEGIN TRANSACTION;
INSERT INTO [dbo].[Provider] ([Id],[Name]) VALUES 
( 1,N'ООО Поставщик 1' ),
( 2,N'ООО Поставщик 2' ),
( 3,N'ООО Поставщик 3' ),
( 4,N'Магнит' )
COMMIT TRANSACTION;

GO

SET IDENTITY_INSERT [dbo].[Provider] OFF
GO
SET IDENTITY_INSERT [dbo].[Order] ON
GO
BEGIN TRANSACTION;
INSERT INTO [dbo].[Order] ([Id],[number],[Date],[ProviderId]) VALUES 
( 1,N'Заказ 001',N'2023-03-24 01:55:48',1 ),
( 12,N'Заказ 001',N'1970-01-01 03:00:00',2 ),
( 14,N'Заказ 001',N'2023-03-24 01:55:48',3 ),
( 15,N'Заказ 002',N'2023-03-26 08:00:12',1 ),
( 16,N'Заказ 003',N'2023-03-29 16:28:54',4 )
COMMIT TRANSACTION;

GO

SET IDENTITY_INSERT [dbo].[Order] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderItem] ON
GO
BEGIN TRANSACTION;
INSERT INTO [dbo].[OrderItem] ([Id],[OrderId],[Name],[Quantity],[Unit]) VALUES 
( 2,1,N'Товар 1',N'10',N'шт' ),
( 3,1,N'Товар 2',N'10',N'кг' ),
( 4,1,N'Товар 3',N'10',N'гр' ),
( 5,12,N'Товар 4',N'20',N'шт' ),
( 6,12,N'Товар 5',N'20',N'кг' ),
( 7,12,N'Товар 6',N'20',N'гр' ),
( 8,14,N'Товар 7',N'30',N'кг' ),
( 9,14,N'Товар 8',N'30',N'шт' ),
( 10,14,N'Товар 9',N'30',N'гр' ),
( 11,15,N'Товар 15',N'10',N'шт' ),
( 14,16,N'Картошка',N'15',N'кг' )
COMMIT TRANSACTION;

GO

SET IDENTITY_INSERT [dbo].[OrderItem] OFF
GO
BEGIN TRANSACTION;

-- CREATE LINK "FK__Order__ProviderI__2BFE89A6" ----------------
ALTER TABLE [dbo].[Order]
	ADD CONSTRAINT [FK__Order__ProviderI__2BFE89A6]
	FOREIGN KEY ([ProviderId])
	REFERENCES [dbo].[Provider]( [Id] )
	ON DELETE No Action
	ON UPDATE No Action
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

BEGIN TRANSACTION;

-- CREATE LINK "FK__OrderItem__Order__2EDAF651" ----------------
ALTER TABLE [dbo].[OrderItem]
	ADD CONSTRAINT [FK__OrderItem__Order__2EDAF651]
	FOREIGN KEY ([OrderId])
	REFERENCES [dbo].[Order]( [Id] )
	ON DELETE No Action
	ON UPDATE No Action
GO;
-- -------------------------------------------------------------

COMMIT TRANSACTION;
GO

