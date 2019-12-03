import { h, Component } from 'preact';
import PropTypes from 'prop-types';

// Note: If you are using p5, you can uncomment all of the p5 lines
// and things should just work =)

const { p5 } = window;

class GameContainer extends Component {
    componentWillMount() {
        //Include all scripts here
        require('script-loader!app/index.js');
        require('script-loader!app/helpers/clickable.js');
        require('script-loader!app/entities.js');
        require('script-loader!app/utilities.js');
        require('script-loader!app/helpers/functions.js');
        require('script-loader!app/helpers/p5-play.js');

    }

    componentDidMount() {
        this.p5Game = new p5(null, document.getElementById('game-container'));
        try {

        } catch (err) {
            console.log('did', err);
        }
    }

    componentWillUnmount() {
        try {
            this.p5Game.remove();
        } catch (err) {
            console.log('unmount', JSON.stringify(err, null, 2));
        }
    }

    render() {
        return (
            <div id={'game-container'} />
        );
    }
}

export default GameContainer;
