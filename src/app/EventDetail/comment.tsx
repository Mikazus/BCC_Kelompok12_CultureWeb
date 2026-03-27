import { FormEvent, useState } from "react"
import { eventComments } from "./data"
import type { EventComment } from "./data"

type CommentSectionProps = {
	comments?: EventComment[]
	isLoading?: boolean
	errorMessage?: string | null
	isPosting?: boolean
	onSubmitComment?: (comment: string, parentId?: string) => Promise<boolean>
}

const CommentSection = ({
	comments = eventComments,
	isLoading = false,
	errorMessage = null,
	isPosting = false,
	onSubmitComment,
}: CommentSectionProps) => {
	const [commentText, setCommentText] = useState("")
	const [parentId, setParentId] = useState("")

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!onSubmitComment || !commentText.trim()) {
			return
		}

		const isSuccess = await onSubmitComment(commentText, parentId || undefined)
		if (isSuccess) {
			setCommentText("")
			setParentId("")
		}
	}

	return (
		<section className="mx-auto mb-14 mt-10 w-[92%] max-w-338">
			<h3 className="text-4xl font-semibold text-[#2f2416]">Komentar</h3>

			<div className="mt-5 space-y-3">
				<form onSubmit={handleSubmit} className="rounded-xl border border-[#cfb78f] bg-[#f7f1e7] p-4">
					<textarea
						value={commentText}
						onChange={(event) => setCommentText(event.target.value)}
						placeholder="Tulis komentar..."
						className="min-h-20 w-full resize-y rounded-lg border border-[#d7c39d] bg-[#fffaf2] px-3 py-2 text-sm text-[#3e2d15] placeholder:text-[#8e7653] outline-none focus:border-[#b59462]"
					/>
					<input
						value={parentId}
						onChange={(event) => setParentId(event.target.value)}
						placeholder="Parent ID (opsional)"
						className="mt-2 h-10 w-full rounded-lg border border-[#d7c39d] bg-[#fffaf2] px-3 text-sm text-[#3e2d15] placeholder:text-[#8e7653] outline-none focus:border-[#b59462]"
					/>
					<div className="mt-3 flex justify-end">
						<button
							type="submit"
							disabled={isPosting || !commentText.trim()}
							className="rounded-full bg-[#a7864f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#8f6f3e] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isPosting ? "Mengirim..." : "Kirim Komentar"}
						</button>
					</div>
				</form>

				{isLoading ? (
					<p className="rounded-xl border border-[#cfb78f] bg-[#f7f1e7] px-4 py-3 text-sm text-[#7f6b49]">
						Memuat komentar...
					</p>
				) : null}

				{errorMessage ? (
					<p className="rounded-xl border border-[#d6b07a] bg-[#fff4e2] px-4 py-3 text-sm text-[#7a4c1c]">
						{errorMessage}
					</p>
				) : null}

				{!isLoading && comments.length === 0 ? (
					<p className="rounded-xl border border-[#cfb78f] bg-[#f7f1e7] px-4 py-3 text-sm text-[#7f6b49]">
						Belum ada komentar untuk event ini.
					</p>
				) : null}

				{comments.map((comment) => (
					<article
						key={comment.id}
						className="rounded-xl border border-[#cfb78f] bg-[#f7f1e7] px-4 py-3 shadow-[0_4px_12px_rgba(86,65,32,0.06)]"
					>
						<div className="flex items-start gap-3">
							<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#95c63d] text-xs font-bold text-white">
								{comment.author.charAt(0).toUpperCase()}
							</span>
							<div>
								<p className="text-xs text-[#7f6b49]">{comment.author}</p>
								<p className="mt-1 text-sm text-[#3e2d15]">{comment.text}</p>
								<p className="mt-1 text-xs text-[#9c8563]">{comment.timeLabel}</p>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default CommentSection
