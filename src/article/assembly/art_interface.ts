import { PersistentVector, u128 } from "near-sdk-as"
import { AccountId } from "../../utils"

@nearBindgen
export class ArticleToken {
    id: i32
    content: string
    owner_id: AccountId
    pub: boolean
    // constructor(id: i32, content: string, owner_id: AccountId, pub: boolean) {
    //     this.id = id
    //     this.content = content
    //     this.owner_id = owner_id
    //     this.pub = pub
    // }
}

export interface nearArticleCore {
    post_article(
        content: string,
        pub: boolean
    ): i32

    read_article(art_id: i32): ArticleToken | null

}