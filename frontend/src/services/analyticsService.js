import api from './api';export const dashboard=()=>api.get('/analytics/dashboard');export const campaignAnalytics=id=>api.get(`/analytics/campaign/${id}`);
