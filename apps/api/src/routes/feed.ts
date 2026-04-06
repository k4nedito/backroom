import { FastifyInstance } from "fastify";
import { getActiveJobs } from "../services/feed";

export async function feedRoutes(app: FastifyInstance) {
  app.get("/feed/jobs", async (req) => {
    const query = req.query as Record<string, string>;

    const jobs = await getActiveJobs({
      search: query.search || undefined,
      workType: query.workType || undefined,
      workMode: query.workMode || undefined,
      talentLevel: query.talentLevel || undefined,
      budgetType: query.budgetType || undefined,
    });

    return { jobs };
  });
}
