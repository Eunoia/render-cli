import { apiGetAction, Subcommand } from "../_helpers.ts";
import { getConfig } from "../../config/index.ts";
import { getRequestJSONList } from "../../api/index.ts";
import { getLogger } from "../../util/logging.ts";

const desc = `Fetches environmental variables for a single service.`;

export const servicesEnvCommand = new Subcommand()
  .name("env")
  .description(desc)
  .option("--format <fmt:string>", "interactive output format", {
    default: "table",
  })
  .option(
    "--key <key:string>",
    "Only show a specific key",
  )
  .option(
    "--columns <cols:string[]>",
    "if --format table, the columns to show.",
    {
      default: ["key", "value"],
    }
  )
  .group("Presentational controls")
  .group("API parameters")
  .option("--id <serviceId:string>", "the service ID (e.g. `srv-12345`)")
  .action((opts) =>
    apiGetAction({
      format: opts.format,
      tableColumns: opts.columns,
      processing: async () => {
        const cfg = await getConfig();
        const logger = await getLogger();

        logger.debug("dispatching getRequestJSON");
        const ret: Record<string, string>[] = await getRequestJSONList(
          logger,
          cfg,
          "envVar",
          `/services/${opts.id}/env-vars`
        );

        if (opts.key){
          return ret.filter((r ) => r.key == opts.key);
        }
        return ret;
      },
    }
  )
);
