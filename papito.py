import csv
import re
import io
from copy import deepcopy

# Sample Input 0
input_data = '''"131594", "", "BIDGROUP", 1, 0, 0, 2, "", 0:00, 0:00, 01JAN2009, 01JAN2009, 01JAN2009, 01JAN2009, false, 0,
"131594", "AWARD", "UNTOUCHABLE", 1, 1, 0, 1, "", 0:00, 0:00, 10JUN2014, 13JUN2014 23:59, 01JAN2009, 01JAN2009, false, 100,
"131594", "AWARD", "ADVANCED_TRIP", 1, 2, 0, 0, "740025Jun2014,705406Jun2014,737722Jun2014,696130Jun2014", 0:00, 0:00, 01JAN2009, 01JAN2009, false, 15,
'''

# Read input into rows
rows = list(csv.reader(io.StringIO(input_data), skipinitialspace=True))

# Processing as per the provided script
out_rows = []
i = 0
while i < len(rows):
    row = rows[i]
    if row and row[2] == "BIDGROUP":
        header = deepcopy(row)
        n = int(header[6])  # Int1 original
        acts = deepcopy(rows[i+1:i+1+n])

        expanded = []
        for act in acts:
            if act[2] == "ADVANCED_TRIP":
                for item in re.split(r"\s*,\s*", act[7]):
                    if not item:
                        continue
                    trip_id = item[:4]
                    new_act = deepcopy(act)
                    new_act[2] = "TRIP_ID"
                    new_act[7] = trip_id
                    new_act[6] = "0"
                    expanded.append(new_act)
            else:
                expanded.append(act)

        for idx, act in enumerate(expanded, 1):
            act[4] = str(idx)  # Renumber Line
        header[6] = str(len(expanded))  # Update Int1 in header

        out_rows.append(header)
        out_rows.extend(expanded)
        i += 1 + n
    else:
        out_rows.append(row)
        i += 1

# Write output to buffer
output_buffer = io.StringIO()
writer = csv.writer(output_buffer, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
for r in out_rows:
    writer.writerow(r)

# Display the transformed output
print(output_buffer.getvalue())
