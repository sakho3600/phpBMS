INSERT INTO `scheduler` (`uuid`, `name`, `job`, `crontab`, `lastrun`, `startdatetime`, `enddatetime`, `description`, `inactive`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('schd:fb52e7fb-bb49-7f5f-89e1-002b2785f085', 'Clean Import Files', './scheduler_delete_tempimport.php', '30::*::*::*::*', '2009-05-28 12:30:02', '2009-05-07 17:27:13', NULL, 'This will delete any temporary import files that are present (for whatever reason) after 30 minutes of their creation.', '0', 1, NOW(), 1, NOW());
INSERT INTO `scheduler` (`uuid`, `name`, `job`, `crontab`, `lastrun`, `startdatetime`, `enddatetime`, `description`, `inactive`, `createdby`, `creationdate`, `modifiedby`, `modifieddate`) VALUES ('schd:d1c247de-9811-d37f-ad94-a8472dc1bc9c', 'Remove Excess System Log Records', './scheduler_delete_logs.php', '*::24::*::*::*', NULL, '2009-03-31 12:00:00', NULL, 'This script will trim the system log when there are more than 2000 records present at the time of its calling (default will be every 24 hours).', '0', 1, NOW(), 1, NOW());