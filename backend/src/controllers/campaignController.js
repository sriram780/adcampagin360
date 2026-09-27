import { Advertisement, Campaign, CampaignMetric } from '../models/index.js';

const campaignIncludes = [{ model: Advertisement, as: 'advertisements' }];

async function getAccessibleCampaign(campaignId, user, include = []) {
  const campaign = await Campaign.findByPk(campaignId, { include });
  if (!campaign) {
    const error = new Error('Campaign not found');
    error.status = 404;
    throw error;
  }
  if (user.role !== 'ADMIN' && campaign.advertiserId !== user.id) {
    const error = new Error('Campaign access denied');
    error.status = 403;
    throw error;
  }
  return campaign;
}

export async function create(req, res, next) {
  try {
    const campaign = await Campaign.create({ ...req.body, advertiserId: req.user.id, status: 'DRAFT' });
    res.status(201).json({ message: 'Campaign created', campaign });
  } catch (error) { next(error); }
}

export async function list(req, res, next) {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { advertiserId: req.user.id };
    const campaigns = await Campaign.findAll({ where, include: campaignIncludes, order: [['createdAt', 'DESC']] });
    res.json({ campaigns });
  } catch (error) { next(error); }
}

export async function get(req, res, next) {
  try {
    const campaign = await getAccessibleCampaign(req.params.id, req.user, [...campaignIncludes, { model: CampaignMetric, as: 'metrics' }]);
    res.json({ campaign });
  } catch (error) { next(error); }
}

export async function update(req, res, next) {
  try {
    const campaign = await getAccessibleCampaign(req.params.id, req.user);
    // Ownership is assigned when a campaign is created and is never editable through this API.
    const { advertiserId, status, ...updates } = req.body;
    await campaign.update(updates);
    res.json({ message: 'Campaign updated', campaign });
  } catch (error) { next(error); }
}

export async function remove(req, res, next) {
  try {
    const campaign = await getAccessibleCampaign(req.params.id, req.user);
    await campaign.destroy();
    res.status(204).end();
  } catch (error) { next(error); }
}

export async function status(req, res, next) {
  try {
    const campaign = await getAccessibleCampaign(req.params.id, req.user);
    const allowedStatuses = ['DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED'];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid campaign status' });
    if (req.user.role !== 'ADMIN' && req.body.status === 'ACTIVE') return res.status(403).json({ message: 'Only an admin can activate a campaign' });
    await campaign.update({ status: req.body.status });
    res.json({ message: 'Status updated', campaign });
  } catch (error) { next(error); }
}
