INSERT INTO reports VALUES ('This report will gerneate and display an invoice in PDF format (which can be printed or saved).  The PDF file will contain one page per invoice.',6,'Invoice','modules/bms/report/invoices_pdfinvoice.php','PDF Report',2,'2003-01-29 09:26:05',2,20050330124703,3,100,0);
INSERT INTO reports VALUES ('This report will gerneate and display a work order  in PDF format (which can be printed or saved).  The PDF file will contain one page per work order.',7,'Work Order','modules/bms/report/invoices_pdfworkorder.php','PDF Report',2,'2003-02-10 15:42:07',2,20051011112615,3,100,20);
INSERT INTO reports VALUES ('This report will gerneate and display an invoice packing list in PDF format (which can be printed or saved).  The PDF file will contain one page per invoice packing list.',8,'Packing List','modules/bms/report/invoices_pdfpackinglist.php','PDF Report',2,'2003-02-11 13:44:12',2,20050330124732,3,100,0);
INSERT INTO reports VALUES ('Avery 5160 or compatible (3x10) Instructor Folder labels. \r\n\r\n **MAKE SURE when printing the pdf file, to TURN OFF the option \"shrink oversized pages to paper size\".**',9,'Labels - Folder','modules/bms/report/clients_folderlabels.php','PDF Report',2,'2003-02-28 10:48:49',2,20050403144824,2,50,0);
INSERT INTO reports VALUES ('Avery 5160 or compatible (3x10) Instructor Folder labels. \r\n\r\n **MAKE SURE when printing the pdf file, to TURN OFF the option \"shrink oversized pages to paper size\".**',12,'Labels - Mailing','modules/bms/report/clients_mailinglabels.php','PDF Report',2,'2005-02-17 13:38:47',2,20050403144831,2,50,0);
INSERT INTO reports VALUES ('Avery 5160 or compatible (3x10) Instructor Folder labels. \r\n\r\n **MAKE SURE when printing the pdf file, to TURN OFF the option \"shrink oversized pages to paper size\".**',13,'Labels - Shipping','modules/bms/report/clients_shippinglabels.php','PDF Report',2,'2005-02-17 15:41:37',2,20050403141925,2,50,0);
INSERT INTO reports VALUES ('Avery 5160 or compatible (3x10) Instructor Folder labels. \r\n\r\n **MAKE SURE when printing the pdf file, to TURN OFF the option \"shrink oversized pages to paper size\".**',14,'Labels - Shipping','modules/bms/report/invoices_shippinglabels.php','PDF Report',2,'2005-02-18 10:54:55',2,20050403144840,3,60,0);
INSERT INTO reports VALUES ('Creater your own custom invoice totaling report, specify groupings, totals, averages and whether to display summary, invoice, and invoice detail information.',15,'Totals - Custom','modules/bms/report/invoices_totals.php','report',2,'2005-02-25 10:51:11',2,20051006113147,3,50,30);
INSERT INTO reports VALUES ('Basic totals report. Shows invoice total, subtotal and amount due fields  and displaying indidivdual invoice information.',16,'Totals - Amt. w/  Invoices','modules/bms/report/invoices_totals_amtwinv.php','report',2,'2005-03-30 13:01:24',2,20051006113047,3,50,30);
INSERT INTO reports VALUES ('Basic totals report. Shows invoice total, subtotal and amount due fields  and displaying indidivdual invoice and line item information.',17,'Totals - Amt. w/ Invoices + Line Items','modules/bms/report/invoices_totals_amtwinvlineitems.php','report',2,'2005-03-30 13:02:30',2,20051006113059,3,50,30);
INSERT INTO reports VALUES ('Totals report grouping by client account manager',18,'Totals - Grouped by Acct. Manager','modules/bms/report/invoices_totals_acctmngers.php','report',2,'2005-03-30 16:26:07',2,20051006113147,3,50,30);
INSERT INTO reports VALUES ('Totals report including shipping ammount grouped by shipping method',20,'Totals - Grouped by Shipping Method','modules/bms/report/invoices_totals_shippingmethod.php','report',2,'2005-03-30 17:47:51',2,20051006113147,3,50,30);
INSERT INTO reports VALUES ('Totals report grouped by payment method.',21,'Totals - Grouped by Payment Method','modules/bms/report/invoices_totals_payment.php','report',2,'2005-03-30 17:50:49',2,20051006113147,3,50,30);
INSERT INTO reports VALUES ('Totals - Grouped by invoice lead source',22,'Totals - Grouped by Invoice Lead Source','modules/bms/report/invoices_totals_leadsource.php','report',2,'2005-03-30 17:53:41',2,20051006113147,3,50,30);
INSERT INTO reports VALUES ('PDF report for quote.  Does not include amount due.',23,'Quote','modules/bms/report/invoices_pdfquote.php','PDF Report',2,'2005-03-30 17:58:55',2,20051011112828,3,100,20);
INSERT INTO reports VALUES ('Sales History for product including costs, average price and quantities.',24,'Sales History','modules/bms/report/products_saleshistory.php','report',2,'2005-03-31 10:28:04',2,20051006113218,4,100,30);
INSERT INTO reports VALUES ('Client purchase history',25,'Purchase History','modules/bms/report/clients_purchasehistory.php','report',2,'2005-03-31 14:24:39',2,20050331142502,2,10,0);
INSERT INTO reports VALUES ('Creater your own custom line item  totaling report, specify groupings, totals, averages and whether to display summary, invoice, and invoice detail information.',26,'Totals - Custom','modules/bms/report/lineitems_totals.php','report',2,'2005-03-31 16:08:46',2,20051006113147,5,50,30);
INSERT INTO reports VALUES ('Totals report grouped first by product category and then by product.',27,'Totals - Product Categories','modules/bms/report/lineitems_totals_productcategories.php','report',2,'2005-03-31 17:18:23',2,20051006113147,5,50,30);
INSERT INTO reports VALUES ('Totals report grouped by product displaying line items',28,'Totals - Product','modules/bms/report/lineitems_totals_products.php','report',2,'2005-03-31 17:25:34',2,20051006113147,5,50,30);
INSERT INTO reports VALUES ('Totals grouped by invoice lead source and product',29,'Totals - Lead Source','modules/bms/report/lineitems_totals_leadsource.php','report',2,'2005-03-31 17:31:29',2,20051006113147,5,50,30);
INSERT INTO reports VALUES ('Print all notes associated with the client and any notes associated with client invoices.',30,'Client Notes Summary','modules/bms/report/clients_notesummary.php','PDF Report',2,'2005-04-03 13:07:00',2,20050405105038,2,10,0);