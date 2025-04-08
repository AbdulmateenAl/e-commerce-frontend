type Props = {
	show: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

export default function Modal({ show, onClose, children }: Props) {
	return (
		<>
			{show && (
				<div className="flex fixed top-0 right-0 left-0 bottom-0 items-center justify-center">
					<div className="flex flex-col relative bg-linear-to-tr from-black to-white p-7 gap-3 rounded-2xl w-[350px]">
						<div
							className="flex rounded-full size-6 items-center justify-center bg-black text-white absolute right-2 top-2 cursor-pointer"
							onClick={onClose}
						>
							<p>X</p>
						</div>
						<div className="mb-0">{children}</div>
					</div>
				</div>
			)}
		</>
	);
}
