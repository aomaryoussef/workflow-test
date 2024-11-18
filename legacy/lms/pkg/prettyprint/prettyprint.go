package prettyprint

import (
	"os"

	"github.com/kataras/tablewriter"
	"github.com/lensesio/tableprinter"
)

func Tableprint(printable interface{}) {
	printer := tableprinter.New(os.Stdout)
	printer.HeaderLine = false
	printer.BorderTop, printer.BorderBottom, printer.BorderLeft, printer.BorderRight = true, true, true, true
	printer.CenterSeparator = "│"
	printer.ColumnSeparator = "│"
	printer.RowSeparator = "─"
	printer.RowLine = true
	printer.HeaderBgColor = tablewriter.BgBlackColor
	printer.HeaderFgColor = tablewriter.FgGreenColor
	printer.Print(printable)
}
