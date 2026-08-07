package domain

// These constants and JSON shapes are retained only because the generated Ent
// model still maps the legacy announcements table. The 2API branch does not
// expose announcement services or routes.
const (
	AnnouncementStatusDraft      = "draft"
	AnnouncementNotifyModeSilent = "silent"
)

type AnnouncementTargeting struct {
	AnyOf []AnnouncementConditionGroup `json:"any_of,omitempty"`
}

type AnnouncementConditionGroup struct {
	AllOf []AnnouncementCondition `json:"all_of,omitempty"`
}

type AnnouncementCondition struct {
	Type     string  `json:"type"`
	Operator string  `json:"operator"`
	GroupIDs []int64 `json:"group_ids,omitempty"`
	Value    float64 `json:"value,omitempty"`
}
