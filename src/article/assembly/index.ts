import { Context, logging, PersistentMap, PersistentVector, util } from "near-sdk-as";
import { AccountId } from "../../utils";
import { ArticleToken, nearArticleCore } from "./art_interface";
@nearBindgen
export class forumContract implements nearArticleCore {

	// id -> art
	private artByOwnerId: PersistentMap<i32, AccountId> = new PersistentMap<i32, AccountId>("artList")
	// 所有art
	private artCollects: PersistentVector<ArticleToken> = new PersistentVector<ArticleToken>("art")
	// 每个wallet对应的art
	private artByOwnerIds: PersistentMap<AccountId, PersistentVector<i32>> = new PersistentMap<AccountId, PersistentVector<i32>>("i")

	post_article(content: string, pub: boolean): i32 {
		const sender = Context.sender
		assert(content.length > 0, "Content don't empty")
		// 生成id
		// this.artCollects.length + 1, content, sender, pub
		let artToken: ArticleToken = {
			id: this.artCollects.length + 1,
			content: content,
			owner_id: sender,
			pub: pub
		}
		// artToken.id
		logging.log(artToken.content)
		const art_id = this.artCollects.push(artToken)
		logging.log(this.artCollects)
		let onwerArt: PersistentVector<i32> | null = this.artByOwnerIds.get(sender)
		if (onwerArt != null) {
			onwerArt.push(art_id)
		} else {
			onwerArt = new PersistentVector<i32>("owner")
			onwerArt.push(art_id)
		}
		this.artByOwnerIds.set(sender, onwerArt)
		this.artByOwnerId.set(art_id, sender)
		return art_id
	}

	read_article(art_id: i32): ArticleToken | null {
		logging.log(art_id)
		// logging.log(`art ${art.id} ${art.content}`)
		// const art = this.artCollects[art_id]

		// assert(art.id, "Article don't exist")
		// if (art.pub != true) {
		// 	// 判断是否公开 
		// 	assert(this.artByOwnerId.get(art_id) == Context.sender, "You don't have access to content")
		// }
		// let value: Array<ArticleToken> = new Array<ArticleToken>()
		// let articleToken: ArticleToken = {
		// 	content: "123",
		// 	id: 1,
		// 	owner_id: "123",
		// 	pub: true
		// }

		// value.push(articleToken)

		// return value
		// return {
		// 	content: art.content,
		// 	id: art.id,
		// 	owner_id: art.owner_id,
		// 	pub: art.pub
		// }
		return this.artCollects[art_id]
	}

	read_article_list(owner_id: string): Array<ArticleToken> | null {
		const value = this.artByOwnerIds.get(owner_id)
		// const v1 = value.
		// logging.log(`value ${value.first}`)
		assert(value != null, "Don't exist art")
		let values: Array<ArticleToken> = new Array<ArticleToken>()
		if (value != null) {
			for (let index = 0; index < value.length; index++) {
				values.push(this.artCollects[value[index]])
			}
		}
		return values
	}

	get_article(): PersistentVector<ArticleToken> {
		// var test: PersistentMap<string, string> = new PersistentMap<string, string>("m")
		// test.set(msg, msg)
		// const value = test.get(msg)
		// const v1 = value
		// logging.log(`msg ${v1}`)
		// const sender = Context.sender
		let arts: PersistentVector<ArticleToken> = new PersistentVector<ArticleToken>("all")
		for (let index: i32 = 0; index < this.artCollects.length; index++) {
			// logging.log(this.artCollects.last)
			arts.push(this.artCollects[index])
		}
		return arts
	}
}
