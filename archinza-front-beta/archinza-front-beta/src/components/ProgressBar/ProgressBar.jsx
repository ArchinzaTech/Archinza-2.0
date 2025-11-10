import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 15,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.mode === "light" ? "#545554" : "#545554",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    height: 10,
    margin: "5px 0",
    backgroundColor: theme.palette.mode === "light" ? "#EF7B13" : "#EF7B13",
  },
}));

export default BorderLinearProgress;
