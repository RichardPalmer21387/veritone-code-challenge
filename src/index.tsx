import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {App} from './app';
import {AppProvider} from './contexts/app-context';
import {ShoppingListProvider} from './contexts/shopping-list-context';
import reportWebVitals from './report-web-vitals';
import logWelcomeMessage, {} from './utils/console-message';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AppProvider>
				<ShoppingListProvider>
					<App/>
				</ShoppingListProvider>
			</AppProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.querySelector('#root'),
);

logWelcomeMessage();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
