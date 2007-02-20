CREATE TABLE clientemailprojects (
  id int(11) NOT NULL auto_increment,
  name varchar(64) default '',
  userid int(11) NOT NULL default '0',
  emailto varchar(9) NOT NULL default '',
  emailfrom varchar(128) default '',
  subject varchar(128) default '',
  body text,
  lastrun timestamp(14) NOT NULL,
  PRIMARY KEY  (id)
) TYPE=MyISAM;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL auto_increment,
  `firstname` varchar(64) default NULL,
  `lastname` varchar(64) default NULL,
  `company` varchar(128) default NULL,
  `type` enum('prospect','client') NOT NULL default 'prospect',
  `becameclient` date default NULL,
  `inactive` tinyint(4) NOT NULL default '0',
  `category` varchar(128) default NULL,
  `homephone` varchar(25) default NULL,
  `workphone` varchar(25) default NULL,
  `mobilephone` varchar(25) default NULL,
  `fax` varchar(25) default NULL,
  `otherphone` varchar(25) default NULL,
  `email` varchar(128) default NULL,
  `webaddress` varchar(128) default NULL,
  `salesmanagerid` int(11) default NULL,
  `leadsource` varchar(64) default NULL,
  `address1` varchar(128) default NULL,
  `address2` varchar(128) default NULL,
  `city` varchar(64) default NULL,
  `state` varchar(5) default NULL,
  `postalcode` varchar(15) default NULL,
  `country` varchar(64) default '',
  `shiptoaddress1` varchar(128) default NULL,
  `shiptoaddress2` varchar(128) default NULL,
  `shiptocity` varchar(64) default NULL,
  `shiptostate` varchar(5) default NULL,
  `shiptopostalcode` varchar(15) default NULL,
  `shiptocountry` varchar(64) default '',
  `comments` text,
  `paymentmethodid` int(10) unsigned default '0',
  `shippingmethodid` int(10) unsigned default '0',
  `discountid` int(10) unsigned default '0',
  `taxareaid` int(11) default '0',
  `username` varchar(32) default NULL,
  `password` varchar(32) default NULL,
  `createdby` int(11) NOT NULL default '0',
  `creationdate` datetime NOT NULL default '0000-00-00 00:00:00',
  `modifiedby` int(11) default NULL,
  `modifieddate` timestamp NOT NULL,
  UNIQUE KEY `theid` (`id`),
  KEY `notin` (`inactive`),
  KEY `thefirstname` (`firstname`),
  KEY `address` (`address1`),
  KEY `zip` (`postalcode`),
  KEY `created` (`creationdate`),
  KEY `thelastname` (`lastname`),
  KEY `thecompany` (`company`),
  KEY `thetype` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 PACK_KEYS=0;


CREATE TABLE discounts (
  id int(11) NOT NULL auto_increment,
  name varchar(128) default '',
  inactive tinyint(1) NOT NULL default '0',
  type enum('percent','amount') NOT NULL default 'percent',
  value double NOT NULL default '0',
  description text,
  createdby int(11) default NULL,
  modifiedby int(11) default NULL,
  modifieddate timestamp(14) NOT NULL,
  creationdate datetime default NULL,
  PRIMARY KEY  (id)
) TYPE=MyISAM;

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `clientid` int(11) NOT NULL default '0',
  `type` enum('Quote','Order','Invoice','VOID') default NULL,
  `status` enum('Open','Committed','Packed','Shipped') default NULL,
  `statusid` int(10) unsigned default NULL,
  `statusdate` date default NULL,
  `assignedtoid` int(10) unsigned default NULL,
  `ponumber` varchar(64) default NULL,
  `orderdate` date default NULL,
  `invoicedate` date default NULL,
  `requireddate` date default NULL,
  `leadsource` varchar(64) default NULL,
  `address1` varchar(128) default NULL,
  `address2` varchar(128) default NULL,
  `city` varchar(64) default NULL,
  `state` varchar(5) default NULL,
  `postalcode` varchar(15) default NULL,
  `country` varchar(64) default '',
  `weborder` tinyint(1) default '0',
  `webconfirmationno` varchar(64) default '',
  `discountid` int(11) NOT NULL default '0',
  `discountamount` double NOT NULL default '0',
  `totaltni` double default '0',
  `taxareaid` int(11) default '0',
  `taxpercentage` double default NULL,
  `totaltaxable` double default '0',
  `tax` double default '0',
  `shippingmethodid` int(10) unsigned default NULL,
  `totalweight` double default '0',
  `trackingno` varchar(64) default NULL,
  `shipping` double default '0',
  `totalcost` double default '0',
  `totalti` double default '0',
  `amountpaid` double default '0',
  `paymentmethodid` int(10) unsigned default NULL,
  `ccexpiration` varchar(10) default NULL,
  `ccnumber` varchar(64) default NULL,
  `ccverification` varchar(4) default '',
  `bankname` varchar(64) default NULL,
  `checkno` varchar(32) default NULL,
  `routingnumber` int(10) unsigned default NULL,
  `accountnumber` int(10) unsigned default NULL,
  `transactionid` varchar(64) default NULL,
  `printedinstructions` text,
  `specialinstructions` text,
  `createdby` int(11) NOT NULL default '0',
  `creationdate` datetime NOT NULL default '0000-00-00 00:00:00',
  `modifiedby` int(11) default NULL,
  `modifieddate` timestamp,
  UNIQUE KEY `theid` (`id`),
  KEY `client` (`clientid`)
) TYPE=MyISAM PACK_KEYS=0;


CREATE TABLE lineitems (
  createdby int(11) NOT NULL default '0',
  creationdate datetime NOT NULL default '0000-00-00 00:00:00',
  id int(11) NOT NULL auto_increment,
  invoiceid int(11) NOT NULL default '0',
  modifiedby int(11) default NULL,
  modifieddate timestamp(14) NOT NULL,
  productid int(11) default NULL,
  quantity double default NULL,
  unitcost double default NULL,
  unitprice double default NULL,
  unitweight double default NULL,
  memo text,
  taxable tinyint(4) NOT NULL default '1',
  UNIQUE KEY theid (id),
  KEY invoice (invoiceid),
  KEY product (productid)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE prerequisites (
  childid int(11) NOT NULL default '0',
  id int(11) NOT NULL auto_increment,
  parentid int(11) NOT NULL default '0',
  UNIQUE KEY theid (id),
  KEY child (childid),
  KEY parent (parentid)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE productcategories (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(64) default NULL,
  `inactive` TINYINT UNSIGNED DEFAULT 0,
  `description` text,
  `webenabled` tinyint(1) NOT NULL default 0,
  `webdisplayname` varchar(64) default '',
  `createdby` int(11) NOT NULL default 0,
  `creationdate` datetime NOT NULL default '0000-00-00 00:00:00',
  `modifiedby` int(11) default NULL,
  `modifieddate` timestamp(14) NOT NULL,
  PRIMARY KEY(`id`)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE products (
  categoryid int(11) NOT NULL default '0',
  createdby int(11) NOT NULL default '0',
  creationdate datetime NOT NULL default '0000-00-00 00:00:00',
  description varchar(255) default NULL,
  id int(11) NOT NULL auto_increment,
  isoversized tinyint(4) NOT NULL default '0',
  isprepackaged tinyint(4) NOT NULL default '0',
  packagesperitem double default NULL,
  modifiedby int(11) default NULL,
  modifieddate timestamp(14) NOT NULL,
  partname varchar(128) default NULL,
  partnumber varchar(32) NOT NULL default '',
  status varchar(32) NOT NULL default 'In Stock',
  unitcost double default '0',
  unitofmeasure varchar(64) default NULL,
  unitprice double default '0',
  weight double default NULL,
  webenabled tinyint(1) NOT NULL default '0',
  keywords varchar(128) default NULL,
  thumbnail mediumblob,
  thumbnailmime varchar(128) default NULL,
  picture mediumblob,
  picturemime varchar(128) default NULL,
  webdescription text,
  inactive tinyint(4) NOT NULL default '0',
  type enum('Inventory','Non-Inventory','Service','Kit','Assembly') NOT NULL default 'Inventory',
  taxable tinyint(4) NOT NULL default '1',
  memo text,
  upc varchar(128) default NULL,
  UNIQUE KEY theid (id),
  UNIQUE KEY thpartnum (partnumber),
  KEY status (status)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE tax (
  id int(11) NOT NULL auto_increment,
  name varchar(64) default NULL,
  percentage double NOT NULL default '0',
  `inactive` TINYINT UNSIGNED DEFAULT 0,
  createdby int(11) NOT NULL default '0',
  creationdate datetime NOT NULL default '0000-00-00 00:00:00',
  modifiedby int(11) default NULL,
  modifieddate timestamp(14) NOT NULL,
  UNIQUE KEY theid (id)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE `shippingmethods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `inactive` tinyint(4) DEFAULT 0,
  `priority` int(11) DEFAULT 0,
  `canestimate` tinyint(4) DEFAULT 0,
  `estimationscript` VARCHAR(128),
  `createdby` INTEGER UNSIGNED,
  `creationdate` DATETIME,
  `modifiedby` INTEGER UNSIGNED,
  `modifieddate` TIMESTAMP,
  PRIMARY KEY(`id`)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE `paymentmethods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL default '',
  `type` enum('draft','charge','receivable') default NULL,
  `priority` int(8) NOT NULL default '0',
  `inactive` tinyint(1) NOT NULL default '0',
  `onlineprocess` tinyint(1) NOT NULL default '0',
  `processscript` varchar(128) default '',
  `createdby` int(11) default NULL,
  `creationdate` datetime default NULL,
  `modifiedby` int(11) default NULL,
  `modifieddate` timestamp NOT NULL,
  PRIMARY KEY  (`id`)
) TYPE=MyISAM PACK_KEYS=0;

CREATE TABLE `invoicestatuses` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128),
  `invoicedefault` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `defaultassignedtoid` INTEGER UNSIGNED,
  `inactive` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `priority` INTEGER UNSIGNED NOT NULL DEFAULT 0,
  `createdby` INTEGER UNSIGNED,
  `creationdate` DATETIME,
  `modifiedby` INTEGER UNSIGNED,
  `modifieddate` TIMESTAMP,
  PRIMARY KEY(`id`)
)
ENGINE = MYISAM;

CREATE TABLE `invoicestatushistory` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoicedefault` INTEGER UNSIGNED,
  `invoiceid` INTEGER UNSIGNED,
  `invoicestatusid` INTEGER UNSIGNED,
  `statusdate` DATE,
  `assignedtoid` INTEGER UNSIGNED,
  PRIMARY KEY(`id`)
)
ENGINE = MYISAM;