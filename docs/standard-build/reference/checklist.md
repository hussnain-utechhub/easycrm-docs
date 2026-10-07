---
title: Rebuild checklist
sidebar_position: 1
---

# Rebuild checklist

Building this in a fresh org, in an order where nothing depends on something that does not exist
yet.

## 1. Fields

- [ ] Create the four extra phone fields — `Phone_2__c` … `Phone_5__c`
- [ ] Create the six status fields — `Phone_Status__c`, `Phone_2_Status__c` … `Phone_5_Status__c`, `Mobile_Status__c`
- [ ] Create `Best_Phone__c` (Phone) and `Best_Phone_Status__c` (Text 255)
- [ ] Check those two have **different** API names — the original document gives them the same one
- [ ] Create `Bucket_Status__c` with [its nineteen values](./bucket-statuses.md#bucket-status)
- [ ] Create `Follow_Up_Date__c`, `BDR__c`, `Contact_Owner_Rep__c`
- [ ] Create `Campaign_List_Name__c`
- [ ] Create `Website__c`, `LinkedIn_URL__c`, `Company_LinkedIn_URL__c`, `Call_Recording__c`
- [ ] Create `Validator_Notes__c` and `Custom_1__c` … `Custom_6__c`
- [ ] Set field-level security so callers can read and edit them

## 2. Activity fields

- [ ] Add `Source_Phone__c` and `Target_Phone__c` to Task
- [ ] Add the call-recording field to Task
- [ ] Confirm **Call Result** is populated by whatever logs the calls

## 3. Layouts

- [ ] Put Best Phone and Best Phone Status directly under Title on Contact
- [ ] Add a **Buckets** section holding the statuses, the other numbers and Custom 1–6
- [ ] Add Source Phone, Target Phone and the recording to the Task layout
- [ ] Leave the enrichment-vendor fields off both

## 4. The flow

- [ ] Build `Getting_Best_Status` first — nothing else works without it
- [ ] Create the flow as **record-triggered, before save**, on Contact, created **or** updated
- [ ] Optimise for **Fast Field Updates**
- [ ] Add the two Assignments, then the Decision with its **seven outcomes in order**
- [ ] Add the seven Update Records elements, including the **Default** that blanks Best Phone
- [ ] Activate it, then save a contact and confirm Best Phone fills in
- [ ] Full detail: [The Best Phone flow](../automation/best-phone.md)

## 5. Folders

- [ ] Create **Buckets Reports**, **Buckets Dashboard** and **List Templates for Frontspin Playbooks**
- [ ] Decide who can see each — [Folders](../reports/folders.md)

## 6. Reports

- [ ] Build the [calculation reports](../reports/calculation.md) first; the dashboards need them
- [ ] Add each report's [formula columns](../reports/formulas.md) — a tile is a formula, not a count
- [ ] Build the [everyday reports](../reports/everyday.md)
- [ ] Build the [templates](../reports/templates.md)
- [ ] Build the [P1 Tracker reports](../reports/p1-tracker.md)
- [ ] Keep the **DO NOT TOUCH** suffix on anything a dashboard reads

## 7. Dashboards

- [ ] [Calling Dashboard](../dashboards/calling.md)
- [ ] [Calling Dashboard V2](../dashboards/calling-v2.md)
- [ ] [P1 Tracker](../dashboards/p1-tracker.md)
- [ ] Set each dashboard's filters, and check which object each filter comes from
- [ ] Set **View Dashboard As** deliberately

## 8. Check it

- [ ] Save a contact with several numbers; the right one lands in Best Phone
- [ ] Log a call with each Call Result; it lands in the right calculation report
- [ ] A dashboard tile moves when the underlying report does
- [ ] A template report returns the people you expect before anyone maps it to a FrontSpin list

## Before you let anyone use it

- [ ] Everyone knows **DO NOT TOUCH** means the dashboards break if you edit it
- [ ] Everyone knows [Call Result is free text](./bucket-statuses.md#call-results), so spelling matters
- [ ] Somebody owns the **Bad Data** report and actually reads it
