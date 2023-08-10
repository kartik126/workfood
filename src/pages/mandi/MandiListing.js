import { TableBody, TableCell, TableRow, Checkbox } from "@mui/material";
import { MuiTable, TableLoader, NoDataFound } from "../../components";
import { formateFireStoreDate } from "../../utils/helper";

export const MandiListing = (props) => {
  const {
    data,
    isLoading,
    headingItems,
    selectedItems = [],
    onSelectItems = () => {},
    isCheckBox = true,
  } = props;
  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  return (
    <MuiTable {...props}>
      <TableBody>
        {isLoading ? (
          <TableLoader colSpan={headingItems.length} />
        ) : data && data.length > 0 ? (
          data.map(
            (
              {
                id,
                commodityName,
                mandiName,
                maxPrice,
                minPrice,
                variety,
                averagePrice,
                createdAt,
              },
              index
            ) => {
              const isItemSelected = isSelected(id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={id}
                  selected={isItemSelected}
                >
                  {isCheckBox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        onChange={({ target }) =>
                          onSelectItems(target.checked, false, id)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {formateFireStoreDate(createdAt)}
                  </TableCell>
                  <TableCell>{commodityName}</TableCell>
                  <TableCell>{mandiName}</TableCell>
                  <TableCell>{variety}</TableCell>
                  <TableCell>{maxPrice}</TableCell>
                  <TableCell>{minPrice}</TableCell>
                  <TableCell>{averagePrice}</TableCell>
                </TableRow>
              );
            }
          )
        ) : (
          <NoDataFound colSpan={headingItems.length} />
        )}
      </TableBody>
    </MuiTable>
  );
};
