import * as React from 'react';
// Redux Stuff
import { connect } from 'react-redux';
import { getLoadingUI, getPolicy as getPolicySelector } from '../../../redux/selectors/ui-selectors';
import { getPolicy } from '../../../redux/actions/ui-actions';
// Markdown
import ReactMarkdown = require('react-markdown');
import gfm = require('remark-gfm');
// MUI Stuff
import makeStyles from '@material-ui/core/styles/makeStyles';
// Components
import DialogInfo from '../../dialogs/dialog-info/dialog-info';
import CircularProgress from '../../buttons/circular-progress/circular-progress';
// Functions
// Types
import { State } from '../../../redux/redux-types';
import { COURSE_PRICE } from '../../../../utils/consts.js';


const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: 100
  },
  progress: {
    position: `absolute`,
    top: `50%`,
    left: `50%`,
    color: theme.palette.primary.main
  }
}));


type Props = {
  open: boolean;
  onClose: () => void;
}


// Всплывающее окно с каким-то children
const PriceAndConditions: React.FC<Props> = ({ open, onClose }) => {
  const classes = useStyles();

  const priceText = `
  Стоимость подписки на 1 мес. - ${COURSE_PRICE}р. за 1 участника.\n\n
  _**После окончания подписки:**_\n
  - _У участника остаётся полный доступ к материалам курса._
  - _Выполненные задания не проверяются._
  - _Нет возможности переписываться с Супервайзером в заданиях._
  `;

  const Component = (<div className={classes.container}>
    <ReactMarkdown plugins={[gfm]} linkTarget="_blank" children={priceText} />
  </div>);

  return (
    <DialogInfo
      open={open}
      title={`Стоимость и условия`}
      children={Component}
      onClose={onClose}
    />
  );
};

const mapStateToProps = (state: State) => ({
});

const mapActionsToProps = {
};

export default connect(mapStateToProps, mapActionsToProps)(PriceAndConditions);
