import {
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  Button,
  Chip,
} from "@mui/material";
import { MuiTable, TableLoader, NoDataFound } from "../../components";
import { toastMessages, toastTypes } from "../../constants/keywords";
import { collections } from "../../firebase/collections";
import { updateDocument } from "../../firebase/services/updateServices";
import { useToaster } from "../../hooks";
import { formateFireStoreDate } from "../../utils/helper";

export const ItemListing = (props) => {
  const {
    data,
    isLoading,
    headingItems,
    selectedItems = [],
    onSelectItems = () => {},
    isCheckBox = true,
  } = props;

  const { toaster } = useToaster();

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  const onChangeStatus = async (id, currentStatus) => {
    try {
      const res = await updateDocument(
        { id, status: currentStatus === "A" ? "D" : "A" },
        collections.listing
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(
          toastTypes.SUCCESS,
          toastMessages.UPDATE_STATUS_LISTING_SUCCESS
        );
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <MuiTable {...props}>
      <TableBody>
        {isLoading ? (
          <TableLoader colSpan={headingItems.length} />
        ) : data && data.length > 0 ? (
          data.map(
            (
              {
                phoneno,
                date,
                id,
                selectedCategory,
                selectedSubcategory,
                min,
                max,
                status,
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
                    {phoneno ? `+91${phoneno}` : ""}
                  </TableCell>
                  <TableCell>{selectedCategory || ""}</TableCell>
                  <TableCell>{formateFireStoreDate(date)}</TableCell>
                  <TableCell>
                    {selectedSubcategory ? (
                      <Chip
                        label={selectedSubcategory.toUpperCase()}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>{`${min}-${max}`}</TableCell>
                  {/* <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => onChangeStatus(id, status)}
                    >
                      {status === "A" ? "DEACTIVE" : "ACTIVE"}
                    </Button>
                  </TableCell> */}
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
