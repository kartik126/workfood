import { DeleteForever, Edit } from "@mui/icons-material";
import {
  Avatar,
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  Box,
} from "@mui/material";
import { MuiTable, TableLoader, NoDataFound } from "../../components";
import { formateFireStoreDate } from "../../utils/helper";

export const ProductListing = (props) => {
  const {
    data,
    isLoading,
    handleEdit,
    handleDelete,
    headingItems,
    selectedItems = [],
    onSelectItems = () => {},
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
                name,
                images,
                updatedAt,
                price,
                categorie,
                qty = 0,
                totalQuantity = 0,
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
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        alt="product image"
                        src={images && images?.at(0)?.url}
                        sx={{ width: 34, height: 34 }}
                      />
                      {name}
                    </Box>
                  </TableCell>
                  <TableCell>{formateFireStoreDate(updatedAt)}</TableCell>
                  <TableCell>{id}</TableCell>
                  <TableCell>{totalQuantity - qty}</TableCell>
                  <TableCell>{categorie}</TableCell>
                  <TableCell>
                    <Edit color="primary" onClick={() => handleEdit(id)} />{" "}
                    <DeleteForever
                      color="error"
                      onClick={() => handleDelete(id)}
                    />
                  </TableCell>
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
