import * as React from 'react'
import cl from 'classnames'
// Routes
import { Link } from 'react-router-dom'
import route from '../../utils/routes/routes'
// Redux Stuff
import { connect } from 'react-redux'
import { getAuthenticated } from '../../redux/selectors/user-selectors'
// MUI Stuff
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
// Icons
// Components
import LogoBtn from '../buttons/logo-btn/logo-btn'
import CheckSertificate from '../sertificates/check-sertificate/check-sertificate'
import PriceAndConditions from '../informations/price-and-conditions/price-and-conditions'
// Functions
import logger from '../../utils/client-logger/client-logger'
// Types & Consts
import { LogoBtnType } from '../../../types/types'
import { ASSEMBLY_TIME } from '../../../utils/consts'
import { State } from '../../redux/redux-types'


const log = logger(`Footer`);



const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    height: `max-content`,
    position: `relative`,
    backgroundColor: `#565656`, // theme.palette.primary.main,
  },
  colorAuth: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  container: {
    display: `flex`,
    alignItems: `flex-start`,
    maxWidth: `1200px`,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  column: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `baseline`,
  },
  logo: {
    justifyContent: `space-between`,
    height: 100,
    paddingTop: 3,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  buttons: {
    padding: theme.spacing(1, 3),
    margin: theme.spacing(0, 2),
  },
  button: {
    textTransform: 'none',
    color: `#b3b3b3`,
  },
  assembly: {
    fontSize: `0.6rem`,
    color: `#666666`,
    fontStyle: `italic`,
    marginLeft: 2,
  }
}));


type Props = {
  authenticated: boolean;
};


// Подвал
const Footer: React.FC<Props> = ({ authenticated }) => {
  const classes = useStyles();

  const [checkSert, setCheckSert] = React.useState(false);
  const handleCheckSertOpen = () => setCheckSert(true);
  const handleCheckSertClose = () => setCheckSert(false);

  const handleRecomendationOpen = () => log(`Нажали "Рекомендации по прохождению курса"`);

  const [priceAndConditions, setPriceAndConditions] = React.useState(false);
  const handlePriceAndConditionsOpen = () => setPriceAndConditions(true);
  const handlePriceAndConditionsClose = () => setPriceAndConditions(false);

  const handleContactsOpen = () => log(`Нажали "Контакты"`);
  const handleDocumentationOpen = () => log(`Нажали "Документация"`);


  return (
    <>
      <AppBar position="static" className={cl(classes.appBar, {[classes.colorAuth]: authenticated})}>
        <Toolbar className={classes.container}>

          <div className={cl(classes.column, classes.logo)}>
            <LogoBtn type={LogoBtnType.NAV_UP} />
            <div className={classes.assembly}>{`Сборка ${ASSEMBLY_TIME}`}</div>
          </div>

          <div className={classes.grow} />

          <div className={classes.column}>
            <Button
              className={cl(classes.buttons, {[classes.button]: !authenticated}, {[classes.colorAuth]: authenticated})}
              onClick={handleRecomendationOpen}
            >
              Рекомендации по прохождению курса
            </Button>
            <Button
              className={cl(classes.buttons, {[classes.button]: !authenticated}, {[classes.colorAuth]: authenticated})}
              onClick={handlePriceAndConditionsOpen}
            >
              Стоимость и условия
            </Button>
          </div>

          <div className={classes.grow} />

          <div className={classes.column}>
            <Button
              className={cl(classes.buttons, {[classes.button]: !authenticated}, {[classes.colorAuth]: authenticated})}
              onClick={handleDocumentationOpen}
            >
              Документация
                {/* Договор оферты */}
                {/* ИНН */}
                {/* ОГРНИП */}
            </Button>
            <Button
              className={cl(classes.buttons, {[classes.button]: !authenticated}, {[classes.colorAuth]: authenticated})}
              onClick={handleCheckSertOpen}
            >
              Проверить сертификат
            </Button>
            <Button
              className={cl(classes.buttons, {[classes.button]: !authenticated}, {[classes.colorAuth]: authenticated})}
              onClick={handleContactsOpen}
            >
              Контакты
            </Button>

          </div>
          
        </Toolbar>
      </AppBar>
      
      <CheckSertificate open={checkSert} onClose={handleCheckSertClose} />
      <PriceAndConditions open={priceAndConditions} onClose={handlePriceAndConditionsClose} />
    </>
  );
};


const mapStateToProps = (state: State) => ({
  authenticated: getAuthenticated(state),
});

export default connect(mapStateToProps)(Footer);
