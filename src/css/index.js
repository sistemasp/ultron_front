import { makeStyles } from "@material-ui/core";

const drawerWidth = 300;
const marginBase = 10;

const myStyles = (colorBase) => makeStyles( (theme) => {

    return {
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        paper: {
            position: 'absolute',
            width: '60%',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: 15
        },
        paper_95: {
            position: 'absolute',
            width: "95%",
            height: "95%",
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        paper_principal: {
            width: "95%",
            margin: 25,
            boxShadow: theme.shadows[5],
        },
        paper_factura: {
            position: 'relative',
            width: "100%",
            height: "40%",
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 3),
        },
        textField: {
            width: '100%',
        },
        formControl: {
            minWidth: 120,
            width: '100%',
        },
        grid_center: {
            placeSelf: 'center',
        },
        button: {
            width: '100%',
            color: '#FFFFFF',
            backgroundColor: colorBase,
        },
        buttonCancel: {
            width: '100%',
            color: '#FFFFFF',
            backgroundColor: "#FF2233",
        },
        label: {
            marginTop: '0px',
            marginBottom: '0px',
            textAlign: 'center',
        },
        label_left: {
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '10px',
            textAlign: 'left',
        },
        label_right: {
            marginTop: '0px',
            marginBottom: '0px',
            marginRight: '10px',
            textAlign: 'right',
        },
        label_foot: {
            fontSize: '11px',
            marginTop: '0px',
            marginRight: '10px',
            marginBottom: '10px',
            textAlign: 'right',
            fontWeight: 'bold',
        },
        labelItemLeft: {
            marginTop: '0px',
            marginBottom: '0px',
            textAlign: 'left',
        },
        labelSubItemLeft: {
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '15px',
            marginRight: '15px',
            textAlign: 'left',
        },
        labelItemRight: {
            marginTop: '0px',
            marginBottom: '0px',
            marginRight: '10px',
            textAlign: 'right',
        },
        labelBig: {
            fontSize: '50px',
            marginTop: '0px',
            marginBottom: '0px',
            textAlign: 'center',
        },
        gridItem: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        root: {
            display: 'flex',
        },
        subRoot: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
        appBar: {
            backgroundColor: colorBase,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
            padding: '0px',
        },
        contentShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
            padding: '0px',
        },
        title: {
            flexGrow: 1,
        },
        fragment: {
            width: '100%',
            padding: '0px',
        },
        container_main: {
            width: `calc(100% - ${marginBase * 2}px)`,
            height: `calc(100% - ${marginBase * 2}px)`,
            margin: '10px',
        },
        container_child: {
            height: `calc(100% - ${marginBase * 2}px)`,
        },
        select: {
            height: '100%'
        },
        bar: {
			backgroundColor: colorBase,
		},
		tabs: {
			fontSize: 16,
			height: 65,
		},
        foot: {
            height: '150px',
        }
    }
}
);

export default myStyles;