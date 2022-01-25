import {SxProps, Modal, Backdrop, Fade, Box, Typography, ButtonGroup, Button} from '@mui/material';
import React from 'react';

const style: SxProps = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export function ConfirmDeleteModal({open, closeModal, confirmDelete}: {
	open: boolean;
	closeModal: () => void;
	confirmDelete: () => void;
}) {
	return <Modal
		aria-labelledby="transition-modal-title"
		aria-describedby="transition-modal-description"
		open={open}
		onClose={closeModal}
		closeAfterTransition
		BackdropComponent={Backdrop}
		BackdropProps={{
			timeout: 500,
		}}
	>
		<Fade in={open}>
			<Box sx={style}>
				<Typography id="transition-modal-title" variant="h6" component="h2">
					Delete Item?
				</Typography>
				<Typography id="transition-modal-description" sx={{mt: 2}}>
					Are you sure you want to delete this item? This can not be undone.
				</Typography>
				<ButtonGroup>
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={confirmDelete}>Delete</Button>
				</ButtonGroup>
			</Box>
		</Fade>
	</Modal>;
}