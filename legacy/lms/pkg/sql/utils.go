package sql

import "github.com/jmoiron/sqlx"

func ReadSqlRowsIntoAMap(rows *sqlx.Rows) (data []map[string]interface{}, err error) {
	data = make([]map[string]interface{}, 0)
	for rows.Next() {
		rowMap := make(map[string]interface{})
		err = rows.MapScan(rowMap)
		if err != nil {
			return
		}
		data = append(data, rowMap)
	}
	return
}
