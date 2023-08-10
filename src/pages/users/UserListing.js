import {
  Avatar,
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { MuiTable, TableLoader, NoDataFound } from "../../components";
import { getAddress } from "../../utils/helper";

export const UserListing = (props) => {
  const {
    data,
    isLoading,
    headingItems,
    selectedItems,
    onSelectItems,
    onClickRow,
  } = props;

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  return (
    <MuiTable {...props}>
      <TableBody>
        {isLoading ? (
          <TableLoader colSpan={headingItems.length} />
        ) : data && data.length > 0 ? (
          data.map(({ id, address, userprofile, phone }, index) => {
            const isItemSelected = isSelected(id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <TableRow
                hover
                sx={{ cursor: "pointer" }}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={id}
                selected={isItemSelected}
                onClick={() => onClickRow(id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectItems(e.target.checked, false, id);
                    }}
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
                      src={userprofile?.user_profile}
                      sx={{ width: 34, height: 34 }}
                    />
                    <Stack>
                      <Typography>
                        {userprofile?.name
                          ? `${userprofile?.name} ${userprofile?.last}`
                          : "Farmful User"}
                      </Typography>
                      <Typography>{phone ? `+91${phone}` : ""}</Typography>
                    </Stack>
                  </Box>
                </TableCell>
                {/* <TableCell>{""}</TableCell> */}
                <TableCell>
                  {address && address.length > 0
                    ? getAddress(address.at(0))
                    : ""}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <NoDataFound colSpan={headingItems.length} />
        )}
      </TableBody>
    </MuiTable>
  );
};
