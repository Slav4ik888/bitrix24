import * as React from 'react'
import cl from 'classnames'
// Redux Stuff
import { connect } from 'react-redux'
import { updateOneTask} from '../../../redux/actions/data-actions'
import { getUserId } from '../../../redux/selectors/user-selectors'
// MUI Stuff
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// Components
import DialogTitle from '../dialog-title/dialog-title';

// Functions
// Types
import { TaskStatusConst, typeTaskStatusArr } from '../../../../types/types-require'
import { TaskBtnType } from '../../../../types/tasks'
import { Dispatch, State } from '../../../redux/redux-types'
import themes from '../../../utils/themes/themes'


const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    // border: `1px solid #000`,
    // backgroundColor: themes.tasks.taskContainer,
    // boxShadow: `1px 1px 5px #ccc`,
    // borderRadius: `3px`,
  },
  
}));


type Props = {
  open: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  title: string;
  children: JSX.Element;
  onClose: () => void;
}


// Всплывающее окно с каким-то children
const DialogInfo: React.FC<Props> = ({ open, maxWidth = "md", fullWidth = true, title, children, onClose }) => {
  if (!open) return null;

  const classes = useStyles();


  return (
    <Dialog
      open={open}
      onClose={onClose}
      // className={classes.container}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle onClose={onClose} children={title} />

      <DialogContent className={classes.container}>
        {
          children
        }
      </DialogContent>

    </Dialog>
  );
};

const mapStateToProps = (state: State) => ({
});

const mapActionsToProps = {
};

export default connect(mapStateToProps, mapActionsToProps)(DialogInfo);
