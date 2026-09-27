import { Campaign, CampaignMetric } from '../models/index.js';

const round = (value) => Number(value.toFixed(2));

// The same safe calculations power both dashboard and campaign-level analytics.
export function calculate(metrics) {
  const totals = metrics.reduce((result, metric) => ({
    impressions: result.impressions + Number(metric.impressions),
    clicks: result.clicks + Number(metric.clicks),
    conversions: result.conversions + Number(metric.conversions),
    spend: result.spend + Number(metric.spend),
  }), { impressions: 0, clicks: 0, conversions: 0, spend: 0 });

  return {
    ...totals,
    spend: round(totals.spend),
    ctr: totals.impressions ? round((totals.clicks / totals.impressions) * 100) : 0,
    cpc: totals.clicks ? round(totals.spend / totals.clicks) : 0,
    conversionRate: totals.clicks ? round((totals.conversions / totals.clicks) * 100) : 0,
  };
}

function buildDailyPerformance(metrics) {
  const daily = new Map();
  metrics.forEach((metric) => {
    const current = daily.get(metric.date) || { date: metric.date, impressions: 0, clicks: 0, conversions: 0, spend: 0 };
    daily.set(metric.date, calculate([current, metric]));
    daily.get(metric.date).date = metric.date;
  });
  return [...daily.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export async function dashboard(where = {}) {
  const campaigns = await Campaign.findAll({ where, include: [{ model: CampaignMetric, as: 'metrics' }] });
  const metrics = campaigns.flatMap((campaign) => campaign.metrics);
  return {
    summary: calculate(metrics),
    campaigns: campaigns.map((campaign) => ({ id: campaign.id, campaignName: campaign.campaignName, status: campaign.status, budget: Number(campaign.budget), ...calculate(campaign.metrics) })),
    daily: buildDailyPerformance(metrics),
  };
}
