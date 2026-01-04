import { db } from "@/db";
import {
  customersTable,
  leadsTable,
  activitiesTable,
  productsTable,
  groupsTable,
  messageTemplatesTable,
  groupMembersTable,
} from "@/db/schema";
import { eq, desc, sql, gte, lte, and, count, avg, sum } from "drizzle-orm";

// Lead source distribution
export async function getLeadSourceDistribution() {
  const result = await db
    .select({
      source: leadsTable.source,
      count: sql<number>`count(*)`,
      percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM leads))`,
    })
    .from(leadsTable)
    .groupBy(leadsTable.source)
    .orderBy(desc(sql`count(*)`));

  return result;
}

// Customer demographic analysis
export async function getCustomerDemographics() {
  const [genderDist, maritalStatusDist, insuranceTypeDist] = await Promise.all([
    // Gender distribution
    db
      .select({
        gender: customersTable.gender,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
      })
      .from(customersTable)
      .where(sql`${customersTable.gender} IS NOT NULL`)
      .groupBy(customersTable.gender),

    // Marital status distribution
    db
      .select({
        maritalStatus: customersTable.maritalStatus,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
      })
      .from(customersTable)
      .where(sql`${customersTable.maritalStatus} IS NOT NULL`)
      .groupBy(customersTable.maritalStatus),

    // Insurance type distribution
    db
      .select({
        insuranceType: customersTable.insuranceType,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
      })
      .from(customersTable)
      .where(sql`${customersTable.insuranceType} IS NOT NULL`)
      .groupBy(customersTable.insuranceType),
  ]);

  return {
    gender: genderDist,
    maritalStatus: maritalStatusDist,
    insuranceType: insuranceTypeDist,
  };
}

// Geographic distribution
export async function getGeographicDistribution() {
  const [placeOfBirthDist, residentialAddressDist] = await Promise.all([
    // Place of birth distribution
    db
      .select({
        placeOfBirth: customersTable.placeOfBirth,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
      })
      .from(customersTable)
      .where(sql`${customersTable.placeOfBirth} IS NOT NULL`)
      .groupBy(customersTable.placeOfBirth)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    // Residential address distribution (by city/region)
    db
      .select({
        residentialAddress: customersTable.residentialAddress,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
      })
      .from(customersTable)
      .where(sql`${customersTable.residentialAddress} IS NOT NULL`)
      .groupBy(customersTable.residentialAddress)
      .orderBy(desc(sql`count(*)`))
      .limit(10),
  ]);

  return {
    placeOfBirth: placeOfBirthDist,
    residentialAddress: residentialAddressDist,
  };
}

// Military service status distribution
export async function getMilitaryServiceDistribution() {
  const result = await db
    .select({
      militaryServiceStatus: customersTable.militaryServiceStatus,
      count: sql<number>`count(*)`,
      percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
    })
    .from(customersTable)
    .where(sql`${customersTable.militaryServiceStatus} IS NOT NULL`)
    .groupBy(customersTable.militaryServiceStatus);

  return result;
}

// Occupation distribution
export async function getOccupationDistribution() {
  const result = await db
    .select({
      occupation: customersTable.occupation,
      count: sql<number>`count(*)`,
      percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
    })
    .from(customersTable)
    .where(sql`${customersTable.occupation} IS NOT NULL`)
    .groupBy(customersTable.occupation)
    .orderBy(desc(sql`count(*)`))
    .limit(15);

  return result;
}

// Age distribution analysis
export async function getAgeDistribution() {
  const result = await db
    .select({
      ageGroup: sql<string>`CASE 
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) < 25 THEN 'Under 25'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 25 AND 34 THEN '25-34'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 35 AND 44 THEN '35-44'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 45 AND 54 THEN '45-54'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 55 AND 64 THEN '55-64'
        ELSE '65 and over'
      END`,
      count: sql<number>`count(*)`,
      percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers WHERE ${customersTable.dateOfBirth} IS NOT NULL))`,
    })
    .from(customersTable)
    .where(sql`${customersTable.dateOfBirth} IS NOT NULL`)
    .groupBy(
      sql`CASE 
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) < 25 THEN 'Under 25'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 25 AND 34 THEN '25-34'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 35 AND 44 THEN '35-44'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 45 AND 54 THEN '45-54'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${customersTable.dateOfBirth})) BETWEEN 55 AND 64 THEN '55-64'
        ELSE '65 and over'
      END`
    );

  return result;
}

// Customer lifecycle metrics
export async function getCustomerLifecycleMetrics() {
  const [statusDistribution, conversionRate, avgTimeToConversion, churnRate] =
    await Promise.all([
      // Status distribution
      db
        .select({
          status: customersTable.status,
          count: sql<number>`count(*)`,
          percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM customers))`,
        })
        .from(customersTable)
        .groupBy(customersTable.status),

      // Conversion rate (leads to customers)
      db
        .select({
          conversionRate: sql<number>`(
            (SELECT count(*) FROM customers) * 100.0 /
            (SELECT count(*) FROM leads)
          )`,
        })
        .from(customersTable)
        .limit(1),

      // Average time from lead to customer
      db
        .select({
          avgDaysToConversion: sql<number>`avg(
            EXTRACT(DAY FROM (${customersTable.createdAt} - ${leadsTable.createdAt}))
          )`,
        })
        .from(customersTable)
        .leftJoin(leadsTable, eq(customersTable.leadId, leadsTable.id))
        .where(sql`${leadsTable.createdAt} IS NOT NULL`),

      // Churn rate (deactivated customers)
      db
        .select({
          churnRate: sql<number>`(
            (SELECT count(*) FROM customers WHERE ${customersTable.status} = 'deactivated') * 100.0 /
            (SELECT count(*) FROM customers)
          )`,
        })
        .from(customersTable)
        .limit(1),
    ]);

  return {
    statusDistribution: statusDistribution,
    conversionRate: conversionRate[0]?.conversionRate || 0,
    avgTimeToConversion: avgTimeToConversion[0]?.avgDaysToConversion || 0,
    churnRate: churnRate[0]?.churnRate || 0,
  };
}

// Template usage analytics
export async function getTemplateUsageAnalytics() {
  const [templateUsage, channelUsage, aiVsManual] = await Promise.all([
    // Template usage distribution
    db
      .select({
        templateUsed: activitiesTable.templateUsed,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM activities WHERE ${activitiesTable.templateUsed} IS NOT NULL))`,
      })
      .from(activitiesTable)
      .where(sql`${activitiesTable.templateUsed} IS NOT NULL`)
      .groupBy(activitiesTable.templateUsed)
      .orderBy(desc(sql`count(*)`))
      .limit(10),

    // Channel usage by template
    db
      .select({
        channel: activitiesTable.channel,
        templateUsed: activitiesTable.templateUsed,
        count: sql<number>`count(*)`,
      })
      .from(activitiesTable)
      .where(sql`${activitiesTable.templateUsed} IS NOT NULL`)
      .groupBy(activitiesTable.channel, activitiesTable.templateUsed)
      .orderBy(activitiesTable.channel, desc(sql`count(*)`)),

    // AI generated vs manual messages
    db
      .select({
        isAiGenerated: activitiesTable.isAiGenerated,
        count: sql<number>`count(*)`,
        percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM activities))`,
      })
      .from(activitiesTable)
      .groupBy(activitiesTable.isAiGenerated),
  ]);

  return {
    templateUsage: templateUsage,
    channelUsage: channelUsage,
    aiVsManual: aiVsManual,
  };
}

// Campaign performance metrics
export async function getCampaignPerformanceMetrics() {
  const [groupPerformance, outreachTypePerformance, dailyActivity] =
    await Promise.all([
      // Group performance (messages sent per group)
      db
        .select({
          groupName: groupsTable.name,
          messageCount: sql<number>`count(${activitiesTable.id})`,
          successRate: sql<number>`(
          count(CASE WHEN ${activitiesTable.status} = 'sent' THEN 1 END) * 100.0 / 
          count(${activitiesTable.id})
        )`,
        })
        .from(groupsTable)
        .leftJoin(
          groupMembersTable,
          eq(groupsTable.id, groupMembersTable.groupId)
        )
        .leftJoin(
          activitiesTable,
          eq(groupMembersTable.userId, activitiesTable.customerId)
        )
        .groupBy(groupsTable.id, groupsTable.name)
        .orderBy(desc(sql`count(${activitiesTable.id})`))
        .limit(10),

      // Outreach type performance
      db
        .select({
          outreachType: activitiesTable.outreachType,
          count: sql<number>`count(*)`,
          successRate: sql<number>`(
          count(CASE WHEN ${activitiesTable.status} = 'sent' THEN 1 END) * 100.0 / 
          count(*)
        )`,
          percentage: sql<number>`(count(*) * 100.0 / (SELECT count(*) FROM activities))`,
        })
        .from(activitiesTable)
        .groupBy(activitiesTable.outreachType),

      // Daily activity trends (last 30 days)
      db
        .select({
          date: sql<string>`DATE(${activitiesTable.sentAt})`,
          totalMessages: sql<number>`count(*)`,
          successfulMessages: sql<number>`count(CASE WHEN ${activitiesTable.status} = 'sent' THEN 1 END)`,
          failedMessages: sql<number>`count(CASE WHEN ${activitiesTable.status} = 'failed' THEN 1 END)`,
        })
        .from(activitiesTable)
        .where(
          and(
            sql`${activitiesTable.sentAt} >= CURRENT_DATE - INTERVAL '30 days'`,
            sql`${activitiesTable.sentAt} IS NOT NULL`
          )
        )
        .groupBy(sql`DATE(${activitiesTable.sentAt})`)
        .orderBy(sql`DATE(${activitiesTable.sentAt})`),
    ]);

  return {
    groupPerformance: groupPerformance,
    outreachTypePerformance: outreachTypePerformance,
    dailyActivity: dailyActivity,
  };
}

// Comprehensive BI summary
export async function getComprehensiveBISummary() {
  const [
    leadSource,
    demographics,
    geographic,
    military,
    occupation,
    age,
    lifecycle,
    templates,
    campaigns,
  ] = await Promise.all([
    getLeadSourceDistribution(),
    getCustomerDemographics(),
    getGeographicDistribution(),
    getMilitaryServiceDistribution(),
    getOccupationDistribution(),
    getAgeDistribution(),
    getCustomerLifecycleMetrics(),
    getTemplateUsageAnalytics(),
    getCampaignPerformanceMetrics(),
  ]);

  return {
    leadSource,
    demographics,
    geographic,
    military,
    occupation,
    age,
    lifecycle,
    templates,
    campaigns,
  };
}
