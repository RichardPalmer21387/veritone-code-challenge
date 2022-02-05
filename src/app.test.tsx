import React, {render, screen} from '@testing-library/react';
import {Header} from './components/header';

test('renders learn react link', () => {
	render(<Header/>);
	const titleElement = screen.getByText(/shopping list/i);
	expect(titleElement).toBeInTheDocument();
});
