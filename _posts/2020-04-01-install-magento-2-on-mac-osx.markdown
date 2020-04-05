---
title: "Install Magento 2 on MAC OSX"
layout: post
date: 2020-04-01 22:01
tag:
    - magento
    - macos
image: https://logo-logos.com/wp-content/uploads/2016/10/Magento_logo_logotype.png
headerImage: true
projects: true
description: "Install Magento 2 on MAC OSX"
category: project
author: hiep
externalLink: false
---

## Required system check
* Apache 2.2 or better
* PHP 5.5x or 5.5x
* Mysql 5.6x

## Download and install PHP & MySQL using MAMP
* Download MAMP http://www.mamp.info/en/downloads/

## Download Magento 2 package
* http://devdocs.magento.com/guides/v2.0/install-gde/bk-install-guide.html

## Start MAMP server
* Open MAMP and click Start Servers.

## Installation of Magento 2

* Once the MAMP server is running, go to http://localhost:8888/phpMyAdmin/?lang=en to create the database. 
* Create database name magento.
* Go to http://localhost:8888/magento/setup to start the installation.

And here is where we will configure and administer the details of your newly created store. http://localhost:8888/magento/admin 