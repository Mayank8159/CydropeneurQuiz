import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const XLSX_PATH = resolve(__dirname, "../../../data.xlsx");

const TABLE_NAME = process.env.PARTICIPANTS_TABLE;
const REGION = process.env.AWS_REGION || "ap-south-1";

if (!TABLE_NAME) {
  console.error("PARTICIPANTS_TABLE environment variable is required");
  process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });

async function main() {
  console.log(`Reading from: ${XLSX_PATH}`);

  const buf = readFileSync(XLSX_PATH);
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`Found ${rows.length} participants`);

  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    const email = (row["Email Address"] || row["Email address"] || "").toString().trim().toLowerCase();

    if (!email) {
      skipped++;
      continue;
    }

    const name = (row["Full Name"] || "").toString().trim();
    const phone = (row["Phone Number"] || "").toString().trim();
    const year = (row["Year of Study"] || "").toString().trim();
    const department = (row["Department"] || "").toString().trim();
    const section = (row["Sec & Roll Number (e.g. A-06)"] || "").toString().trim();

    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          email: { S: email },
          name: { S: name },
          phone: { S: phone },
          yearOfStudy: { S: year },
          department: { S: department },
          section: { S: section },
        },
      })
    );

    inserted++;
    if (inserted % 25 === 0) {
      console.log(`Progress: ${inserted} inserted...`);
    }
  }

  console.log(`\nDone! ${inserted} inserted, ${skipped} skipped (no email)`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
